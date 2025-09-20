const express = require("express");
const router = express.Router();
const Remark = require("../models/courseRemarkModel");
const Course = require("../models/CourseModel-instructor");

router.post("/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const { courseRemark } = req.body;

    const remark = new Remark({ courseRemark });
    const savedRemark = await remark.save();

    // Attach Remark to course
    await Course.findByIdAndUpdate(
      courseId,
      { $push: { remarks: savedRemark._id } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Course Remark Created",
      remark: savedRemark,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating Remark",
      error: error.message,
    });
  }
});

// GET: Get course with remarks (for instructor view)
router.get("/:courseId", async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate("remarks"); // populate remarks

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching course",
      error: error.message,
    });
  }
});


// Update remakr status by Instructor
// PUT: Update remark status
router.put("/:remarkId/status", async (req, res) => {
  try {
    const { remarkId } = req.params;
    const { status } = req.body; // expecting { status: "Done" }

    if (!["Pending", "Done"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const updatedRemark = await Remark.findByIdAndUpdate(
      remarkId,
      { status },
      { new: true }
    );

    if (!updatedRemark) {
      return res.status(404).json({ success: false, message: "Remark not found" });
    }

    res.status(200).json({
      success: true,
      message: "Remark status updated",
      remark: updatedRemark,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating remark status",
      error: error.message,
    });
  }
});


module.exports = router;
