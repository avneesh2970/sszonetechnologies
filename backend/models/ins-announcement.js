const mongoose = require("mongoose");

const insAnnouncementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InsAnnouncement", insAnnouncementSchema);

