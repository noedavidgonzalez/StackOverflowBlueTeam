const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const answerSchema = new Schema({
  username: [{type: Schema.ObjectId, ref: 'User'}],
  respuesta: String,
  solved: Boolean 
}, {
  timestamps: true
});

const Answer = mongoose.model("Answer", answerSchema);
module.exports = Answer;

