const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const questionSchema = new Schema({
  username: [{type: Schema.ObjectId, ref: 'User'}],
  pregunta: String,
  respuestas: [{type: Schema.ObjectId, ref: 'Answer'}] 
}, {
  timestamps: true
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;