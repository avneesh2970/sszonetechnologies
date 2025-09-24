const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../middleware/instructor");
const Instructor = require("../models/instructorModel");
const Course = require("../models/CourseModel-instructor");
const AdditionalInfoModel = require("../models/AdditionalInfoModel");
const Module = require("../models/Module");
const fs = require("fs");
const path = require("path");

const upload = require("../multer");
const CourseIntroVideo = require("../models/CourseIntroVideo");

// CREATE course (only logged-in instructor)
router.post(
  "/create",
  authMiddleware,
  upload.single("thumbnail"),
  async (req, res) => {
    try {
      const {
        title,
        slug,
        description,
        regularPrice,
        discountPrice,
        categories,
      } = req.body;

      const instructorId = req.instructorId; // ✅ comes from middleware

      const newCourse = new Course({
        title,
        slug,
        description,
        regularPrice,
        discountPrice,
        categories,
        thumbnail: req.file ? `/uploads/${req.file.filename}` : null,

        instructor: instructorId,
      });

      const savedCourse = await newCourse.save();

      await Instructor.findByIdAndUpdate(instructorId, {
        $push: { courses: savedCourse._id },
      });

      res.status(201).json({
        message: "Course created successfully",
        course: savedCourse,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// additional-info
router.post("/:id/additional-info", authMiddleware, async (req, res) => {
  try {
    const { language, startDate, requirements, description, duration, tags } =
      req.body;

    const newInfo = new AdditionalInfoModel({
      language,
      startDate,
      requirements,
      description,
      duration,
      tags,
    });

    const savedInfo = await newInfo.save();

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { additionalInfo: savedInfo._id },
      { new: true }
    ).populate("additionalInfo");

    res.status(201).json({
      message: "Additional Info added",
      course: updatedCourse,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Course of particular instructor
router.get("/my-courses", authMiddleware, async (req, res) => {
  try {
    const instructorId = req.instructorId;

    const courses = await Course.find({ instructor: instructorId })
      .populate({
        path: "instructor",
        populate: {
          path: "profile",
          model: "InstructorProfile",
          select: "skill bio firstName lastName userName displayNamePubliclyAs",
        },
      })
      .populate("additionalInfo")
      .populate("overview")
      .populate("introVideo")
      .populate({
        path: "modules",
        populate: { path: "lessons" },
      })
      .populate("remarks")
      .sort({createdAt : -1})
    res.status(200).json({
      success: true,
      courses,
      message: "course for Currently Login Instructor",
    });
  } catch {
    res
      .status(500)
      .json({ message: "Error fetching instructor courses", error: err });
  }
});

// GET all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find()
      // .populate("instructor") // populate instructor
      .populate({
        path: "instructor",
        populate: {
          path: "profile",
          model: "InstructorProfile",
          select: "skill bio firstName lastName userName displayNamePubliclyAs",
        },
      })
      .populate("additionalInfo") // populate additional info
      .populate("overview") // populate overview
      .populate("introVideo")
      .populate({
        path: "modules", // populate modules
        populate: { path: "lessons" }, // populate lessons inside each module
      })
      .populate({
        path : "reviews", 
        populate : {path : "userId"}
      });
      

    res.status(200).json({ success: true, courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching courses",
      error: error.message,
    });
  }
});

// UPDATE course status
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    // validate incoming status
    if (!["Published", "Pending", "Draft"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({
      message: `Course status updated to ${status}`,
      course: updatedCourse,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE course
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const courseId = req.params.id;
    const instructorId = req.instructorId; // ✅ from middleware

    // Find course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // ✅ Ensure instructor owns this course
    if (course.instructor.toString() !== instructorId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this course" });
    }

    // ✅ Delete associated intro video if exists
    const introVideo = await CourseIntroVideo.findOne({ course: courseId });
    if (introVideo) {
      // delete the video file if it's a local file
      if (introVideo.videoUrl && introVideo.videoUrl.includes("uploads")) {
        const fileName = introVideo.videoUrl.split("/").pop(); // extract filename
        const videoPath = path.join(__dirname, "..", "uploads", fileName);
        if (fs.existsSync(videoPath)) {
          fs.unlinkSync(videoPath);
        }
      }

      await CourseIntroVideo.findByIdAndDelete(introVideo._id);
    }

    // ✅ Delete uploaded thumbnail if exists
    if (course.thumbnail) {
      const fileName = course.thumbnail.split("/").pop(); // extract filename
      const thumbnailPath = path.join(__dirname, "..", "uploads", fileName);
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }

    // Remove course reference from Instructor
    await Instructor.findByIdAndUpdate(instructorId, {
      $pull: { courses: courseId },
    });

    // ✅ Delete Additional Info if exists
    if (course.additionalInfo) {
      await AdditionalInfoModel.findByIdAndDelete(course.additionalInfo);
    }

    // ✅ Delete Modules & Lessons linked to this course
    const modules = await Module.find({ course: courseId });
    const moduleIds = modules.map((m) => m._id);

    if (moduleIds.length > 0) {
      // Delete all lessons under those modules
      await Lesson.deleteMany({ module: { $in: moduleIds } });
      // Delete the modules themselves
      await Module.deleteMany({ course: courseId });
    }

    // ✅ Finally delete the course
    await Course.findByIdAndDelete(courseId);

    res.status(200).json({
      message:
        "Course, video, files, and all related data deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error deleting course", error: error.message });
  }
});

// Update Course
router.put(
  "/update/:id",
  authMiddleware,
  upload.single("thumbnail"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        title,
        slug,
        description,
        regularPrice,
        discountPrice,
        categories,
      } = req.body;

      // ✅ Find the course first
      const course = await Course.findOne({
        _id: id,
        instructor: req.instructorId,
      });
      if (!course) {
        return res
          .status(404)
          .json({ message: "Course not found or not authorized" });
      }

      // ✅ If new thumbnail is uploaded → delete old one
      if (req.file) {
        if (course.thumbnail) {
          const oldPath = path.join(__dirname, "..", course.thumbnail);
          fs.unlink(oldPath, (err) => {
            if (err)
              console.error("Error deleting old thumbnail:", err.message);
          });
        }
        course.thumbnail = `/uploads/${req.file.filename}`;
      }

      // ✅ Update other fields (only if provided)
      if (title) course.title = title;
      if (slug) course.slug = slug;
      if (description) course.description = description;
      if (regularPrice) course.regularPrice = regularPrice;
      if (discountPrice) course.discountPrice = discountPrice;
      if (categories) course.categories = categories;

      const updatedCourse = await course.save();

      res.status(200).json({
        message: "Course updated successfully",
        course: updatedCourse,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ✅ Update Additional Info for a Course
router.put("/:id/additional-info", authMiddleware, async (req, res) => {
  try {
    const { language, startDate, requirements, description, duration, tags } =
      req.body;

    // 1. Find the course
    const course = await Course.findById(req.params.id).populate(
      "additionalInfo"
    );
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    let savedInfo;

    // 2. If course already has additionalInfo → update it
    if (course.additionalInfo) {
      savedInfo = await AdditionalInfoModel.findByIdAndUpdate(
        course.additionalInfo._id,
        { language, startDate, requirements, description, duration, tags },
        { new: true }
      );
    } else {
      // 3. If not, create a new one
      const newInfo = new AdditionalInfoModel({
        language,
        startDate,
        requirements,
        description,
        duration,
        tags,
      });
      savedInfo = await newInfo.save();

      // Attach to course
      course.additionalInfo = savedInfo._id;
      await course.save();
    }

    const updatedCourse = await Course.findById(req.params.id).populate(
      "additionalInfo"
    );

    res.status(200).json({
      message: "Additional Info updated successfully",
      course: updatedCourse,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
