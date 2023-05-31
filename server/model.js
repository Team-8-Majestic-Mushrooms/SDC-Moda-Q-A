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
      (
        SELECT json_agg(
          json_build_object(
            'id', a.answer_id,
            'body', a.body,
            'date', to_timestamp(a.answer_date / 1000),
            'answerer_name', a.answerer_name,
            'helpfulness', a.helpfulness,
            'photos', (
              SELECT json_agg(p.url)
              FROM photos p
              WHERE p.answer_id = a.answer_id
            )
          )
        )
        FROM answers a
        WHERE a.question_id = q.question_id
      ) AS answers
    FROM questions q
    WHERE q.product_id = ${productId} AND q.reported = 0
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
    const queryString = `
    SELECT
      answers.answer_id,
      answers.question_id,
      answers.body,
      to_timestamp(answers.answer_date / 1000) AS answer_date,
      answers.answerer_name,
      answers.answerer_email,
      answers.reported,
      answers.helpfulness,
      array_agg(photos.url) AS photo_urls
    FROM
      answers
    LEFT JOIN
      photos ON answers.answer_id = photos.answer_id
    WHERE
      answers.question_id = ${questionId} AND
      answers.reported = 0
    GROUP BY
      answers.answer_id,
      answers.question_id,
      answers.body,
      answers.answer_date,
      answers.answerer_name,
      answers.answerer_email,
      answers.reported,
      answers.helpfulness;
  `;
    return db.query(queryString);
  },

  addAnswer: async (data) => {
    // console.log('data', data);
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

    const insertAnswerQuery = `
      INSERT INTO answers (question_id, body, answer_date, answerer_name, answerer_email, reported, helpfulness)
      VALUES (${question_id}, '${body}', ${date_written}, '${name}', '${email}', ${reported}, ${helpfulness})
      RETURNING answer_id;
    `;

    const result = await db.query(insertAnswerQuery);
    // console.log('this is result', result);
    const answerId = result.rows[0].answer_id;
    // console.log('answerID', answerId);

    if (photos && photos.length > 0) {
      const photosArray = Array.isArray(photos) ? photos : [photos];
      const photoValues = photosArray.map((photo) => `(${answerId}, '${photo}')`).join(', ');

      const insertPhotosQuery = `
        INSERT INTO photos (answer_id, url)
        VALUES ${photoValues};
      `;

      db.query(insertPhotosQuery);
    }

    return answerId;
  },

  questionHelpful: (questionId) => {
    const queryString = `UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE question_id = ${questionId}`;
    return db.query(queryString);
  },

  answerHelpful: (answerId) => {
    const queryString = `UPDATE answers SET helpfulness = helpfulness + 1 WHERE answer_id = ${answerId}
    `;
    return db.query(queryString);
  },

  reportQuestion: (questionId) => {
    const queryString = `UPDATE questions SET reported = CASE WHEN reported = 0 THEN 1 ELSE reported END WHERE question_id = ${questionId}
    `;
    return db.query(queryString);
  },

  reportAnswer: (answerId) => {
    const queryString = `UPDATE answers SET reported = CASE WHEN reported = 0 THEN 1 ELSE reported END WHERE answer_id = ${answerId}
    `;
    return db.query(queryString);
  },

};
