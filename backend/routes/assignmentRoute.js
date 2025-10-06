// routes/assignmentRoutes.js
const express = require("express");
const router = express.Router();
const {
  createAssignment,
  getAssignmentsByModule,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  getMyAssignmentStatus,
  getCourseSubmissions,
  getAssignmentSubmissions,
} = require("../controllers/assignmentController");
const { uploadPdf } = require("../middleware/assignmentMulter");
const  requireAuth  = require("../middleware/auth");
const requireInstructor = require('../middleware/instructor')

// CREATE
router.post("/", createAssignment);

router.post("/:assignmentId/submit", requireAuth,  uploadPdf , submitAssignment);
router.get("/:assignmentId/my-status", requireAuth, getMyAssignmentStatus);

// to see assignment and pdf into instructor dashboard 
router.get("/courses/:courseId/submissions", requireAuth, requireInstructor, getCourseSubmissions);
router.get("/assignments/:assignmentId/submissions", requireAuth, requireInstructor, getAssignmentSubmissions);


// READ (by moduleId)
router.get("/:moduleId", getAssignmentsByModule);

// UPDATE
router.put("/:id", updateAssignment);

// DELETE
router.delete("/:id", deleteAssignment);

module.exports = router;
