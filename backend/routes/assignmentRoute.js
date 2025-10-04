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
} = require("../controllers/assignmentController");
const { uploadPdf } = require("../middleware/assignmentMulter");
const  requireAuth  = require("../middleware/auth");

// CREATE
router.post("/", createAssignment);

router.post("/:assignmentId/submit", requireAuth, uploadPdf, submitAssignment);
router.get("/:assignmentId/my-status", requireAuth, getMyAssignmentStatus);

// READ (by moduleId)
router.get("/:moduleId", getAssignmentsByModule);

// UPDATE
router.put("/:id", updateAssignment);

// DELETE
router.delete("/:id", deleteAssignment);

module.exports = router;
