const express = require("express");
const router = express.Router();
const {
  createModule,
  createLesson,
  getModule,
  updateModule,
  updateLesson,
  deleteModule,
  deleteLesson,
} = require("../controllers/moduleController");

// route - /api/course-structure

// Modules
router.post("/module/create", createModule);
router.post("/lesson/create", createLesson);

router.get("/module/:courseId", getModule);

router.put("/module/:id", updateModule);
router.put("/lesson/:id", updateLesson);

router.delete("/module/:id", deleteModule);
router.delete("/lesson/:id", deleteLesson);

module.exports = router;
