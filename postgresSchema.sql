-- psql -U postgres -d sdc -f postgresSchema.sql

-- Drop tables
DROP TABLE IF EXISTS photos CASCADE;
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS questions CASCADE;

-- Create tables
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  product_id INTEGER,
  question_body VARCHAR(1000),
  question_date BIGINT,
  asker_name VARCHAR(50),
  asker_email VARCHAR(50),
  reported INTEGER DEFAULT 0,
  question_helpfulness INTEGER
);

CREATE TABLE IF NOT EXISTS answers (
  id SERIAL PRIMARY KEY,
  question_id INT,
  body TEXT,
  answer_date BIGINT,
  answerer_name VARCHAR(50),
  answerer_email VARCHAR(50),
  reported BOOLEAN,
  helpfulness INT,
  FOREIGN KEY (question_id) REFERENCES questions (id)
);

CREATE TABLE IF NOT EXISTS photos (
 id SERIAL PRIMARY KEY,
 url TEXT NOT NULL,
 answer_id INTEGER NOT NULL
 FOREIGN KEY (answer_id) REFERENCES answers(id)
);

