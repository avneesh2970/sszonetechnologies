// routes/assignmentRoutes.js
const express = require("express");
const router = express.Router();
const {
  createAssignment,
  getAssignmentsByModule,
  updateAssignment,
  deleteAssignment,
} = require("../controllers/assignmentController");

// CREATE
router.post("/", createAssignment);

// READ (by moduleId)
router.get("/:moduleId", getAssignmentsByModule);

// UPDATE
router.put("/:id", updateAssignment);

// DELETE
router.delete("/:id", deleteAssignment);

module.exports = router;
