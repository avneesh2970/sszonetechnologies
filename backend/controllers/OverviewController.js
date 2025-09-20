const Overview = require('../models/overview')
const Course = require("../models/CourseModel-instructor")



// 📌 Create and link overview to a course
exports.createOverview = async (req, res) => {
  try {
    const {
      courseId,
      overviewDescription,
      whatYouWillLearn,
      overviewInstructor,
      videoHours,
      courseLevel,
      overviewLanguage,
      quizzes,
      certificate,
      accessOnMobileAndTV,
    } = req.body;

    // Step 1: Create overview with proper course reference
    const overview = new Overview({
      overviewDescription,
      whatYouWillLearn,
      overviewInstructor,
      videoHours,
      courseLevel,
      overviewLanguage,
      quizzes,
      certificate,
      accessOnMobileAndTV,
      course: courseId, // ✅ Properly link course
    });

    const savedOverview = await overview.save();

    // Step 2: Attach overview to course
    await Course.findByIdAndUpdate(courseId, { overview: savedOverview._id });

    res.status(201).json({
      success: true,
      message: "Overview created and linked to course",
      overview: savedOverview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating overview",
      error: error.message,
    });
  }
};

// 📌 Get all overviews
exports.getAllOverviews = async (req, res) => {
  try {
    const overviews = await Overview.find();
    res.status(200).json({
      success: true,
      count: overviews.length,
      overviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching overviews",
      error: error.message,
    });
  }
};

// 📌 Get overview by ID
exports.getOverviewById = async (req, res) => {
  try {
    const overview = await Overview.findById(req.params.id);
    if (!overview) {
      return res.status(404).json({ success: false, message: "Overview not found" });
    }
    res.status(200).json({ success: true, overview });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching overview",
      error: error.message,
    });
  }
};

// ✅ Update existing overview
exports.updateOverview = async (req, res) => {
  try {
    const { id } = req.params; // overviewId
    const updatedOverview = await Overview.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedOverview) {
      return res.status(404).json({
        success: false,
        message: "Overview not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Overview updated successfully",
      overview: updatedOverview,
    });
  } catch (error) {
    console.error("Error updating overview", error);
    res.status(500).json({
      success: false,
      message: "Error updating overview",
      error: error.message,
    });
  }
};

// 📌 Delete overview (and unlink from course)
exports.deleteOverview = async (req, res) => {
  try {
    const overview = await Overview.findById(req.params.id);
    if (!overview) {
      return res.status(404).json({ success: false, message: "Overview not found" });
    }

    // Remove reference from any course that has this overview
    await Course.updateMany({ overview: overview._id }, { $unset: { overview: "" } });

    await overview.deleteOne();

    res.status(200).json({
      success: true,
      message: "Overview deleted and unlinked from courses",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting overview",
      error: error.message,
    });
  }
};
