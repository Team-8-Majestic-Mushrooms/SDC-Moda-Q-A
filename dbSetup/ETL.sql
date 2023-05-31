
\COPY questions FROM 'csvFiles/questions.csv' DELIMITER ',' CSV HEADER;
\COPY answers FROM 'csvFiles/answers.csv' DELIMITER ',' CSV HEADER;
\COPY photos FROM 'csvFiles/answers_photos.csv' DELIMITER ',' CSV HEADER;


SELECT setval('question_id_sequence', MAX(question_id)+1) FROM questions;
SELECT setval('answer_id_sequence', MAX(answer_id)+1) FROM answers;
SELECT setval('photo_id_sequence', MAX(photo_id)+1) FROM photos;

CREATE INDEX questions_productid_index ON questions (product_id, reported);
CREATE INDEX answer_id_index ON answers (answer_id);
CREATE INDEX question ON answers (question_id);
CREATE INDEX photos_index ON photos USING HASH (answer_id);