/* eslint-disable camelcase */
const db = require('./db.js');

module.exports = {
  getQuestions: (productId) => {
    const queryString = `SELECT * FROM questions WHERE product_id = ${productId} AND reported = 0`;
    console.log('this is query String for questions', queryString);
    return db.query(queryString);
  },

  addQuestion: (questionData) => {
    const {
      product_id, body, date_written, asker_name, asker_email, reported, helpful,
    } = questionData;
    const queryString = `
      INSERT INTO questions (product_id, body, date_written, asker_name, asker_email, reported, helpful)
      VALUES (${product_id}, '${body}', '${date_written}', '${asker_name}', '${asker_email}', ${reported}, ${helpful})
      RETURNING id;
    `;
    return db.query(queryString);
  },

  getAnswers: (questionId) => {
    const queryString = `SELECT * FROM answers WHERE question_id = ${questionId} AND reported = 0`;
    console.log('this is query String for answers', queryString);
    return db.query(queryString);
  },

  addAnswer: (data) => {
    const {
      question_id,
      body,
      answer_date,
      answerer_name,
      answerer_email,
      reported,
      helpfulness,
      photos,
    } = data;

    const queryString = `
    WITH inserted_answer AS (
      INSERT INTO answers (question_id, body, answer_date, answerer_name, answerer_email, reported, helpfulness)
      VALUES (${question_id}, '${body}', ${answer_date}, '${answerer_name}', '${answerer_email}', ${reported ? 1 : 0}, ${helpfulness})
      RETURNING id
    )
    INSERT INTO photos (answer_id, url)
    VALUES
  `;

    const photoValues = photos.map((photo) => `((SELECT id FROM inserted_answer), '${photo.url}')`).join(', ');
    const finalQueryString = `${queryString} ${photoValues} RETURNING (SELECT id FROM inserted_answer)`;

    return db.query(finalQueryString);
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
