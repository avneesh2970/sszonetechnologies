const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // or "User" if you have generic user schema
    required: true,
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  answers: [
    {
      questionId: String,
      selected: String,
      correct: String,
      isCorrect: Boolean,
    },
  ],
  score: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  attemptedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);
