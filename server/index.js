require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const db = require('./db.js')
const controller = require('./controller.js');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API Requests
app.get('/qa/questions', controller.getQuestions);
app.post('/qa/questions', controller.addQuestion);
app.get('/qa/questions', controller.getAnswers);
app.post('/qa/questions/:question_id/answers', controller.addAnswer);

app.put('/qa/questions/helpful', controller.questionHelpful);
app.put('/qa/answers/:answer_id/helpful', controller.answerHelpful);
app.put('/qa/answers/:answer_id/report', controller.reportAnswer);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server available at http://localhost${PORT}`);
});
