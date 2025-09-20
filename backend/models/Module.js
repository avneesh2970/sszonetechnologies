const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }] 
}, { timestamps: true });

module.exports = mongoose.model("Module", moduleSchema);
