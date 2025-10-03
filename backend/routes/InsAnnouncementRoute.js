const express = require("express");
const InsAnnouncement = require("../models/ins-announcement");
const Course = require('../models/CourseModel-instructor');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { title, courseId } = req.body;

    const newAnnouncement = new InsAnnouncement({ title, courseId });
    const savedAnnouncement = await newAnnouncement.save();

    // Add announcement to course
    await Course.findByIdAndUpdate(courseId, {
      $push: { announcement: savedAnnouncement._id }
    });

    res.status(201).json({
      success: true,
      announcement: savedAnnouncement
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { title } = req.body;
    const updatedAnnouncement = await InsAnnouncement.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true }
    );

    if (!updatedAnnouncement) {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }

    res.json({ success: true, announcement: updatedAnnouncement });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Delete Announcement
router.delete("/:id", async (req, res) => {
  try {
    const announcement = await InsAnnouncement.findByIdAndDelete(req.params.id);

    if (!announcement) {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }

    // Remove announcement reference from Course
    await Course.findByIdAndUpdate(announcement.courseId, {
      $pull: { announcement: announcement._id },
    });

    res.json({ success: true, message: "Announcement deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


module.exports = router;
