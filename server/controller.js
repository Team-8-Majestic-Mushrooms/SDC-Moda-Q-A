const model = require('./model.js');

module.exports = {
  getQuestions: (req, res) => {
    model.getQuestions(req.query.product_id)
      .then(res => res.status(200).send({ results: res.rows }))
      .catch(err => res.status(500).send(err));
  },

  addQuestion: (req, res) => { },

  getAnswers: (req, res) => { },

  addAnswer: (req, res) => { },

  questionHelpful: (req, res) => {
    model.questionHelpful(req.query.id)
      .then(res => res.status(200).send('Thank you!'))
      .catch(err => res.status(500).send(err));
  },

  answerHelpful: (req, res) => { },

  reportAnswer: (req, res) => { },

}