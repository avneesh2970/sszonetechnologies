// models/quizAttemptModel.js
const mongoose = require("mongoose");

const answeredQuestionSchema = new mongoose.Schema({
  questionIndex: { type: Number, required: true }, // index in quiz.questions
  selectedOptionIndex: { type: Number, required: false }, // user choice (may be undefined/null)
  isCorrect: { type: Boolean, required: true },
});

const quizAttemptSchema = new mongoose.Schema(
  {
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    answers: [answeredQuestionSchema],
    score: { type: Number, required: true }, // number of correct answers
    total: { type: Number, required: true }, // total questions
    percentage: { type: Number, required: true },
    timeTakenSeconds: { type: Number }, // optional
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attempt", quizAttemptSchema);
