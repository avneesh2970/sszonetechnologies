const express = require("express");
const router = express.Router();
const Review = require("../models/courseReview");
const auth = require("../middleware/auth");
const Course = require("../models/CourseModel-instructor");

router.post("/:courseId", auth, async (req, res) => {
  const { rating, comment } = req.body;
  const { courseId } = req.params;
  const userId = req.user.id; // logged-in user

  try {
    const review = new Review({ courseId, userId, rating, comment });
    await review.save();

     // push review id into course
    await Course.findByIdAndUpdate(courseId, {
      $push: { reviews: review._id }
    });

    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get reviews of a course
router.get("/:courseId", async (req, res) => {
  const { courseId } = req.params;
  try {
    const reviews = await Review.find({ courseId })
      .populate("userId", "name") // get user's name
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all reviews + review of login student(by using filter in frontend)
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "name")
      .populate("courseId", "title")
      .sort({ createdAt: -1 });
    res.status(201).send({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/instructor/me", auth, async (req, res) => {
  try {
    const instructorId = req.user.id; // comes from auth middleware

    // 1. Find all courses of this instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).select("_id title");

    if (!instructorCourses.length) {
      return res.json({ success: true, reviews: [] });
    }

    const courseIds = instructorCourses.map((course) => course._id);

    // 2. Get all reviews for those courses
    const reviews = await Review.find({ courseId: { $in: courseIds } })
      .populate("userId", "name email") // student info
      .populate("courseId", "title") // course info
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    console.error("Error in getInstructorReviews:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
