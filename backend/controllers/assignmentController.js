const Assignment = require("../models/Assignment");
const Module = require("../models/Module");

// ➕ Create assignment
exports.createAssignment = async (req, res) => {
  try {
    const { moduleId, title, summary, questions } = req.body;

    const assignment = new Assignment({
      title,
      summary,
      questions,
      moduleId,
    });

    await assignment.save();

    await Module.findByIdAndUpdate(moduleId, {
      $push: { assignments: assignment._id },
    });

    res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      assignment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📥 Get all assignments of a module
exports.getAssignmentsByModule = async (req, res) => {
  try {
    const { moduleId } = req.params;

    const module = await Module.findById(moduleId)
      .populate("assignments")
      .exec();

    if (!module) {
      return res.status(404).json({ success: false, message: "Module not found" });
    }

    res.json({ success: true, assignments: module.assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✏️ Update assignment
exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, summary, questions } = req.body;

    const assignment = await Assignment.findByIdAndUpdate(
      id,
      { title, summary, questions },
      { new: true } // return updated doc
    );

    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    res.json({ success: true, message: "Assignment updated", assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ❌ Delete assignment
exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findByIdAndDelete(id);

    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    // remove assignment reference from module
    await Module.findByIdAndUpdate(assignment.moduleId, {
      $pull: { assignments: assignment._id },
    });

    res.json({ success: true, message: "Assignment deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
