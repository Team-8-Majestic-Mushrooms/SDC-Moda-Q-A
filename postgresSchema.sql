-- psql -U postgres -d sdc -f postgresSchema.sql

-- Drop tables
DROP TABLE IF EXISTS photos CASCADE;
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS questions CASCADE;


-- Create sequence
CREATE SEQUENCE question_id_sequence;
CREATE SEQUENCE answer_id_sequence;
CREATE SEQUENCE photo_id_sequence;

-- Create tables
CREATE TABLE IF NOT EXISTS questions (
  question_id INTEGER PRIMARY KEY DEFAULT nextval('question_id_sequence'),
  product_id INTEGER,
  question_body VARCHAR(1000),
  question_date BIGINT,
  asker_name VARCHAR(50),
  asker_email VARCHAR(50),
  reported INTEGER DEFAULT 0,
  question_helpfulness INTEGER
);

CREATE TABLE IF NOT EXISTS answers (
  answer_id INTEGER PRIMARY KEY DEFAULT nextval('answer_id_sequence'),
  question_id INT,
  body TEXT,
  answer_date BIGINT,
  answerer_name VARCHAR(50),
  answerer_email VARCHAR(50),
  reported INTEGER DEFAULT 0,
  helpfulness INT,
  FOREIGN KEY (question_id) REFERENCES questions (question_id)
);

CREATE TABLE IF NOT EXISTS photos (
  photo_id INTEGER PRIMARY KEY DEFAULT nextval('photo_id_sequence'),
  answer_id INTEGER NOT NULL,
  url TEXT,
  FOREIGN KEY (answer_id) REFERENCES answers (answer_id)
);

