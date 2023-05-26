
\COPY questions FROM 'csvFiles/questions.csv' DELIMITER ',' CSV HEADER;

\COPY answers FROM 'csvFiles/answers.csv' DELIMITER ',' CSV HEADER;

\COPY photos FROM 'csvFiles/answers_photos.csv' DELIMITER ',' CSV HEADER;

