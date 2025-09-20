// controllers/courseIntroVideoController.js
const CourseIntroVideo = require("../models/CourseIntroVideo");
const Course = require("../models/CourseModel-instructor");

exports.createIntroVideo = async (req, res) => {
  try {
    const { courseId, title, description, videoUrl } = req.body;

    if (!courseId || !title || !videoUrl) {
      return res.status(400).json({ success: false, message: "courseId, title and videoUrl are required" });
    }

    // Create intro video
    const introVideo = new CourseIntroVideo({
      course: courseId,
      title,
      description,
      videoUrl,
    });

    const savedVideo = await introVideo.save();

    // Attach to course
    await Course.findByIdAndUpdate(courseId, { introVideo: savedVideo._id });

    res.status(201).json({
      success: true,
      message: "Intro video added to course",
      introVideo: savedVideo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error creating intro video",
      error: error.message,
    });
  }
};

// ✅ Update Intro Video
exports.updateIntroVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { title, description, videoUrl } = req.body;

    const updatedVideo = await CourseIntroVideo.findByIdAndUpdate(
      videoId,
      { title, description, videoUrl },
      { new: true, runValidators: true }
    );

    if (!updatedVideo) {
      return res.status(404).json({ success: false, message: "Intro video not found" });
    }

    res.status(200).json({
      success: true,
      message: "Intro video updated successfully",
      introVideo: updatedVideo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error updating intro video",
      error: error.message,
    });
  }
};
