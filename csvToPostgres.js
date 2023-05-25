const fs = require('fs');
const fastcsv = require('fast-csv');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sdc',
  password: '',
  port: '5432',
});

const stream = fs.createReadStream('./questions.csv');
const csvData = [];
const csvStream = fastcsv
  .parse()
  .on('data', (data) => {
    csvData.push(data);
  })
  .on('end', () => {
    csvData.shift();

    const transformedData = csvData
      .filter((row) => row[6] !== '1');

    const createTableQuery = `
      CREATE TABLE product (
        product_id SERIAL PRIMARY KEY,
        name VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS questions (
        question_id SERIAL PRIMARY KEY,
        product_id INTEGER,
        body TEXT,
        date_written DATE,
        asker_name VARCHAR(50),
        asker_email VARCHAR(50),
        reported BOOLEAN,
        helpful INTEGER,
        FOREIGN KEY (product_id) REFERENCES product (product_id)
      );

      CREATE TABLE answers (
        answer_id SERIAL PRIMARY KEY,
        answer_body TEXT,
        answer_date TIMESTAMP,
        answerer_name VARCHAR(50),
        helpfulness INT,
        photos TEXT[],
        question_id INT,
        FOREIGN KEY (question_id) REFERENCES questions (question_id)
      );
    `;

    pool.query(createTableQuery, (err, _) => {
      if (err) {
        console.error('Error creating tables:', err);
        pool.end();
        return;
      }

      const insertQuery = `
        INSERT INTO questions (product_id, body, date_written, asker_name, asker_email, reported, helpful)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;

      transformedData.forEach((row) => {
        pool.query(insertQuery, row, (err, res) => {
          if (err) {
            console.error('Error inserting data:', err);
          } else {
            console.log(`inserted ${res.rowCount} row:`, row);
          }
        });
      });

      console.log('Data insertion complete.');
      pool.end();
    });
  });

stream.pipe(csvStream);
