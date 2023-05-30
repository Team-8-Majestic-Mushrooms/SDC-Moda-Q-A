const model = require('./model.js');

module.exports = {
  getQuestions: (req, res) => {
    const { product_id } = req.query;
    console.log('req.query', req.query);

    model.getQuestions(product_id)
      .then((result) => {
        res.json(result.rows);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  },

  addQuestion: (req, res) => {
    const questionData = req.body;

    model.addQuestion(questionData)
      .then(() => {
        res.sendStatus(201);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  },

  getAnswers: (req, res) => {
    console.log('this is req.query', req.params)
    const { question_id } = req.params;
    model.getAnswers(question_id)
      .then((result) => {
        res.json(result.rows);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  },

  addAnswer: (req, res) => {
    const answerData = req.body;
    console.log('req.body', req.body);
    model.addAnswer(answerData)
      .then((result) => {
        res.json({ answerId: result.rows[0].id });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  },

  questionHelpful: (req, res) => {
    const { questionId } = req.params;
    model.questionHelpful(questionId)
      .then(() => {
        res.sendStatus(200);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  },

  answerHelpful: (req, res) => {
    const { answerId } = req.params;
    model.answerHelpful(answerId)
      .then(() => {
        res.sendStatus(200);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  },

  reportAnswer: (req, res) => {
    const { answerId } = req.params;
    model.reportAnswer(answerId)
      .then(() => {
        res.sendStatus(200);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  },
};
