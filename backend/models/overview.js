// OverviewModel.js
const mongoose = require("mongoose");

const overviewSchema = new mongoose.Schema({
  overviewDescription: String,
  whatYouWillLearn: String,
  overviewInstructor: String,
  videoHours: Number,
  courseLevel: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner",
  },
  overviewLanguage: { type: String, default: "Hindi , English " },
  quizzes: { type: Number, default: 0 },
  certificate: { type: Boolean, default: false },
  accessOnMobileAndTV: { type: Boolean, default: true },

  // To link back to course
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
});

module.exports = mongoose.model("Overview", overviewSchema);
