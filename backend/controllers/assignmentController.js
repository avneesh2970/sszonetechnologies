const Assignment = require("../models/Assignment");
const Module = require("../models/Module");

const cloudinary = require("../config/clodinary");


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


exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const studentId = req.user?._id;

    if (!studentId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: "PDF file is required" });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    // Helper: upload buffer to Cloudinary
    const uploadToCloudinary = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            folder: `assignments/${assignmentId}`,
            filename_override: `${studentId}.pdf`,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

    // Check if submission exists
    const index = assignment.submissions.findIndex(
      (s) => String(s.student) === String(studentId)
    );

    // Delete old PDF if resubmitting
    if (index !== -1 && assignment.submissions[index].pdfPublicId) {
      try {
        await cloudinary.uploader.destroy(assignment.submissions[index].pdfPublicId, {
          resource_type: "raw",
        });
      } catch (e) {
        console.warn("Failed to delete old PDF:", e.message);
      }
    }

    const upload = await uploadToCloudinary();

    const payload = {
      student: studentId,
      status: "completed",
      pdfUrl: upload.secure_url,
      pdfPublicId: upload.public_id,
      submittedAt: new Date(),
    };

    if (index === -1) {
      assignment.submissions.push(payload);
    } else {
      assignment.submissions[index] = { ...assignment.submissions[index]._doc, ...payload };
    }

    await assignment.save();

    return res.status(200).json({
      success: true,
      message: "Assignment submitted successfully",
      submission: assignment.submissions.find(
        (s) => String(s.student) === String(studentId)
      ),
    });
  } catch (error) {
    console.error("submitAssignment error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


exports.getMyAssignmentStatus = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const studentId = req.user?._id;

    const assignment = await Assignment.findById(assignmentId)
      .select("title submissions")
      .lean();

    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    const sub =
      assignment.submissions.find((s) => String(s.student) === String(studentId)) ||
      { status: "pending" };

    return res.status(200).json({
      success: true,
      assignmentId,
      title: assignment.title,
      status: sub.status,
      pdfUrl: sub.pdfUrl || null,
      submittedAt: sub.submittedAt || null,
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
