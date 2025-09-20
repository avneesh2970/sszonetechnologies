const mongoose = require("mongoose");

const courseRemarkSchema = new mongoose.Schema(
  {
    courseRemark: {
      type: String,
      trim: true, 
    },
    status: {
      type: String,
      enum: ["Pending", "Done"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CourseRemark", courseRemarkSchema);
