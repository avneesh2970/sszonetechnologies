const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  lessonTitle: { type: String, required: true },
  lessonContent: String,
  lessonImage: String,
  lessonVideoSource: String,
  lessonHour: Number,
  lessonMinute: Number,
  lessonSecond: Number,
  module: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Lesson", lessonSchema);

