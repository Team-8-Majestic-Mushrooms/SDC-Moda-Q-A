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

const processCSV = (filePath, tableName, columnNames, transformationFunction) => {
  const stream = fs.createReadStream(filePath);
  const csvData = [];
  const csvStream = fastcsv
    .parse()
    .on('data', (data) => {
      console.log('this is data', data);
      csvData.push(data);
    })
    .on('end', async () => {
      csvData.shift(); // Remove header row

      const transformedData = csvData.map((row) => {
        const transformedRow = transformationFunction([...row]);
        return transformedRow;
      });

      const insertQuery = `INSERT INTO ${tableName} (${columnNames.join(', ')})
        VALUES (${columnNames.map((_, i) => `$${i + 1}`).join(', ')})`;

      const insertPromises = transformedData.map((row) => pool.query(insertQuery, row));

      Promise.all(insertPromises)
        .then((results) => {
          results.forEach((res, index) => {
            console.log(`Inserted row ${index + 1}:`, transformedData[index]);
          });
          console.log(`Data insertion for ${tableName} complete.`);
        })
        .catch((error) => {
          console.error(`Error inserting data for ${tableName}:`, error);
        })
        .finally(() => {
          if (tableName === 'photos') {
            pool.end();
          }
        });
    });

  stream.pipe(csvStream);
};

// Process questions.csv
processCSV('./questions.csv', 'questions', [
  'id',
  'product_id',
  'body',
  'date_written',
  'asker_name',
  'asker_email',
  'reported',
  'helpful',
], (row) => {
  const transformedRow = [...row];
  transformedRow[3] = new Date(parseInt(row[3]) * 1000);
  return transformedRow;
});
// Process answers.csv
processCSV('./answers.csv', 'answers', [
  'id',
  'question_id',
  'body',
  'date_written',
  'answerer_name',
  'answerer_email',
  'reported',
  'helpful',
], (row) => {
  const transformedRow = [...row];
  transformedRow[3] = new Date(parseInt(row[3]) * 1000);
  return transformedRow;
});

// Process photos.csv
// processCSV('./photos.csv', 'photos', ['id', 'answer_id', 'url'], (row) => row);

// --------------------------------------------------------------------------
// const fs = require('fs');
// const csv = require('csv-parser');
// const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'sdc',
//   password: '',
//   port: '5432',
//   connectionTimeoutMillis: 5000,
// });

// const csvData = [];
// const batchSize = 1000; // Adjust the batch size as needed

// fs.createReadStream('./questions.csv')
//   .pipe(csv())
//   .on('data', (data) => {
//     console.log('this is data', data);
//     csvData.push(data);

//     if (csvData.length >= batchSize) {
//       insertData(csvData);
//     }
//   })
//   .on('end', () => {
//     if (csvData.length > 0) {
//       insertData(csvData);
//     }
//   });

// function insertData(data) {
//   const insertQuery = `
//     INSERT INTO questions (id, product_id, body, date_written, asker_name, asker_email, reported, helpful)
//     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
//   `;

//   const insertPromises = data.map((row) => pool.query(insertQuery, Object.values(row)));

//   Promise.all(insertPromises)
//     .then((results) => {
//       results.forEach((res, index) => {
//         console.log(`Inserted row ${index + 1}:`, data[index]);
//       });
//       console.log('Data insertion complete.');
//     })
//     .catch((error) => {
//       console.error('Error inserting data:', error);
//     })
//     .finally(() => {
//       data.length = 0;
//     });
// }
