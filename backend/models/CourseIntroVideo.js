// models/CourseIntroVideo.js
const mongoose = require("mongoose");

const courseIntroVideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String, required: true }, 
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("CourseIntroVideo", courseIntroVideoSchema);
