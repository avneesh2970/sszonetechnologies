const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }], // multiple choice options
  correctAnswer: { type: Number, required: true } // index of correct option
});

const quizSchema = new mongoose.Schema(
  {
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true },
    title: { type: String, required: true },
    questions: [questionSchema],
   
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
