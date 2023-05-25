import mongoose from 'mongoose';

const { Schema } = mongoose;

const questionSchema = new Schema({
  id: Number,
  product_id: Number,
  body: String,
  date: Date,
  asker_name: String,
  helpfulness: Number,
  reported: Boolean,
  page: Number,
  answer_count: Number,
  answers: [{
    id: Number,
    body: String,
    date: Date,
    answerer_name: String,
    helpfulness: Number,
    photos: [{
      id: Number,
      url: String,
    }],
  }],
});

const Question = mongoose.model('Question', questionSchema);