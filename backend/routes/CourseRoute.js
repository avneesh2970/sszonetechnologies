// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const Course = require("../models/CourseModel");

// // Multer storage config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // make sure 'uploads' exists
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + file.originalname;
//     cb(null, uniqueSuffix);
//   },
// });

// const upload = multer({ storage });

// // CREATE course
// router.post("/create-old", upload.single("thumbnail"), async (req, res) => {
//   try {
//     const {
//       title,
//       slug,
//       description,
//       regularPrice,
//       discountPrice,
//       categories,
//     } = req.body;

//     const newCourse = new Course({
//       title,
//       slug,
//       description,
//       regularPrice,
//       discountPrice,
//       categories: JSON.parse(categories),
//       thumbnail: req.file
//         ? `http://localhost:3999/uploads/${req.file.filename}`
//         : null,
//     });

//     const saved = await newCourse.save();
//     res.json(saved);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to create course" });
//   }
// });


// router.put("/update/:id", upload.single("thumbnail"), async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       title,
//       slug,
//       description,
//       regularPrice,
//       discountPrice,
//       categories,
//     } = req.body;

//     const updateFields = {
//       title,
//       slug,
//       description,
//       regularPrice,
//       discountPrice,
//       categories: JSON.parse(categories),
//     };

//     // If a new thumbnail is uploaded, update it
//     if (req.file) {
//       updateFields.thumbnail = `http://localhost:3999/uploads/${req.file.filename}`;
//     }

//     const updatedCourse = await Course.findByIdAndUpdate(id, updateFields, {
//       new: true,
//     });

//     if (!updatedCourse) {
//       return res.status(404).json({ error: "Course not found" });
//     }

//     res.json(updatedCourse);
//   } catch (err) {
//     console.error("Error updating course:", err);
//     res.status(500).json({ error: "Failed to update course" });
//   }
// });

// router.post("/:id/additional-info", async (req, res) => {
//   try {
//     const {
//       language,
//       startDate,
//       requirements,
//       description,
//       durationHour,
//       durationMinute,
//       tags,
//     } = req.body;

//     const updatedCourse = await Course.findByIdAndUpdate(
//       req.params.id,
//       {
//         language,
//         startDate,
//         requirements,
//         description,
//         durationHour,
//         durationMinute,
//         tags: JSON.parse(tags),
//       },
//       { new: true }
//     );

//     res.json(updatedCourse);
//   } catch (err) {
//     console.error("Error updating additional info:", err);
//     res.status(500).json({ message: "Error updating course additional info" });
//   }
// });
// router.put("/:id/additional-info", async (req, res) => {
//   try {
//     const {
//       language,
//       startDate,
//       requirements,
//       description,
//       durationHour,
//       durationMinute,
//       tags,
//     } = req.body;

//     const updateData = {
//       language,
//       startDate,
//       requirements,
//       description,
//       durationHour,
//       durationMinute,
//     };

//     // Safely parse tags
//     if (tags) {
//       updateData.tags = typeof tags === "string" ? JSON.parse(tags) : tags;
//     }

//     const updatedCourse = await Course.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true }
//     );

//     if (!updatedCourse) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     res.json(updatedCourse);
//   } catch (err) {
//     console.error("❌ Error updating additional info:", err);
//     res.status(500).json({ message: "Error updating course additional info" });
//   }
// });

// router.post("/:id/upload-video", async (req, res) => {
//   try {
//     const { videoUrl } = req.body;
//     const course = await Course.findByIdAndUpdate(
//       req.params.id,
//       { videoUrl },
//       { new: true }
//     );
//     res.json(course);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Error uploading video", error: err.message });
//   }
// });
// router.put("/:id/upload-video", async (req, res) => {
//   try {
//     const { videoUrl } = req.body;

//     const course = await Course.findByIdAndUpdate(
//       req.params.id,
//       { videoUrl },
//       { new: true }
//     );

//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     res.json(course);
//   } catch (err) {
//     console.error("Video upload error:", err);
//     res
//       .status(500)
//       .json({ message: "Error uploading video", error: err.message });
//   }
// });

// router.post("/:id/course-overview", async (req, res) => {
//   try {
//     const {
//       overviewdescription,
//       whatYouWillLearn,
//       overviewinstructor,
//       videoHours,
//       courseLevel,
//       overviewlanguage,
//       quizzes,
//       certificate,
//       accessOnMobileAndTV,
//     } = req.body;

//     const updateOverview = await Course.findByIdAndUpdate(
//       req.params.id,
//       {
//         overviewdescription,
//         whatYouWillLearn,
//         overviewinstructor,
//         videoHours,
//         courseLevel,
//         overviewlanguage,
//         quizzes,
//         certificate,
//         accessOnMobileAndTV,
//       },
//       {
//         new: true,
//       }
//     );
//     res.json(updateOverview);
//   } catch (error) {
//     console.error("Error updating additional info:", err);
//     res.status(500).json({ message: "Error updating course additional info" });
//   }
// });
// router.put("/:id/course-overview", async (req, res) => {
//   try {
//     const {
//       overviewdescription,
//       whatYouWillLearn,
//       overviewinstructor,
//       videoHours,
//       courseLevel,
//       overviewlanguage,
//       quizzes,
//       certificate,
//       accessOnMobileAndTV,
//     } = req.body;

//     const updateData = {
//       overviewdescription,
//       whatYouWillLearn,
//       overviewinstructor,
//       videoHours,
//       courseLevel,
//       overviewlanguage,
//       quizzes,
//       certificate,
//       accessOnMobileAndTV,
//     };

//     const updateOverview = await Course.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true }
//     );

//     if (!updateOverview) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     res.json(updateOverview);
//   } catch (error) {
//     console.error("Error updating course overview:", error);
//     res.status(500).json({ message: "Error updating course overview" });
//   }
// });

// router.get("/all/full", async (req, res) => {
//   try {
//     const allCourses = await Course.find()
//       .sort({ createdAt: -1 })
//       .populate({
//         path: "modules",
//         populate: { path: "lessons" },
//       });

//     res.json(allCourses);
//   } catch (err) {
//     console.error("❌ Error in /api/courses/all/full:", err); // This will help debug
//     res
//       .status(500)
//       .json({ message: "Error getting course", error: err.message });
//   }
// });

// // Get full course with modules and lessons populated
// router.get("/:id/full", async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.id).populate({
//       path: "modules",
//       populate: {
//         path: "lessons",
//       },
//     });

//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     res.json(course);
//   } catch (err) {
//     console.error("Error fetching full course:", err);
//     res.status(500).json({ message: "Error getting course" });
//   }
// });

// router.put('/status/:id', async(req , res)=>{
//   try {
//     const {id} = req.params;
//     const {status} = req.body;

//     if(!["Published", "Pending"].includes(status)){
//       return res.status(400).json({
//         message : "Invalid Status Value"
//       });
//     }

//     const updated = await Course.findByIdAndUpdate(id , {status}, {new : true})

//     if (!updated) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Course status updated",
//       course: updated,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to update course status",
//       error: err.message,
//     });
//   }
// });

// router.delete("/delete/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deleteLesson = await Course.findByIdAndDelete(id);

//     if (!deleteLesson) {
//       return res.status(404).json({
//         success: false,
//         message: "Course not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Course deleted successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete course",
//       error: error.message,
//     });
//   }
// });

// module.exports = router;
  

// this is for Admin course 