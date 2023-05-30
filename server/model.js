/* eslint-disable camelcase */
const db = require('./db.js');

module.exports = {
  getQuestions: (productId) => {
    const queryString = `
      SELECT
        q.question_id,
        q.product_id,
        q.question_body,
        to_timestamp(q.question_date / 1000) AS question_date,
        q.asker_name,
        q.asker_email,
        q.reported,
        q.question_helpfulness,
        json_agg(json_build_object(
          'answer_id', a.answer_id,
          'body', a.body,
          'answer_date', to_timestamp(a.answer_date / 1000),
          'answerer_name', a.answerer_name,
          'helpfulness', a.helpfulness
        )) AS answers
      FROM
        questions q
      LEFT JOIN
        answers a ON q.question_id = a.question_id
      WHERE
        q.product_id = ${productId} AND q.reported = 0
      GROUP BY
        q.question_id;
    `;
    return db.query(queryString);
  },

  addQuestion: (questionData) => {
    const {
      product_id, body, name, email,
    } = questionData;
    const helpful = 0;
    const reported = 0;
    const date_written = Date.now();

    const queryString = `
      INSERT INTO questions (product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness)
      VALUES (${product_id}, '${body}', '${date_written}', '${name}', '${email}', ${reported}, ${helpful})
    `;
    return db.query(queryString);
  },

  getAnswers: (questionId) => {
    const queryString = `SELECT answer_id, question_id, body, to_timestamp(answer_date / 1000) AS answer_date, answerer_name, answerer_email, reported, helpfulness FROM answers WHERE question_id = ${questionId} AND reported = 0`;
    return db.query(queryString);
  },

  addAnswer: (data) => {
    const {
      question_id,
      body,
      name,
      email,
      photos,
    } = data;

    const helpfulness = 0;
    const reported = 0;
    const date_written = Date.now();

    const queryString = `
      WITH inserted_answer AS (
        INSERT INTO answers (question_id, body, answer_date, answerer_name, answerer_email, reported, helpfulness)
        VALUES (${question_id}, '${body}', ${date_written}, '${name}', '${email}', ${reported}, ${helpfulness})
        RETURNING answer_id
      )
    `;

    let finalQueryString = queryString;

    if (photos && photos.length > 0) {
      const photosArray = Array.isArray(photos) ? photos : [photos];
      const photoValues = photosArray.map((photo) => `((SELECT answer_id FROM inserted_answer), '${photo}')`).join(', ');
      finalQueryString += `
        INSERT INTO photos (answer_id, url)
        VALUES ${photoValues};
      `;
    }

    finalQueryString += `
      SELECT answer_id FROM inserted_answer;
    `;

    const result = db.query(finalQueryString);
    return result.rows;
  },

  questionHelpful: (questionId) => {
    const queryString = `UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE id = ${questionId}`;
    return db.query(queryString);
  },

  answerHelpful: (answerId) => {
    const queryString = `UPDATE answers SET helpfulness = helpfulness + 1 WHERE id = ${answerId}
    `;
    return db.query(queryString);
  },

  reportAnswer: (answerId) => {
    const queryString = `UPDATE answers SET reported = CASE WHEN reported = 0 THEN 1 ELSE reported END WHERE id = ${answerId}
    `;
    return db.query(queryString);
  },

};
