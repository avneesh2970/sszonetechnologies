const Module = require("../models/Module");
const Lesson = require("../models/LessonModel");
const Course = require("../models/CourseModel-instructor");

// Create a module and link to a course
exports.createModule = async (req, res) => {
  try {
    const { title, courseId } = req.body;

    const newModule = new Module({ title, courseId });
    const savedModule = await newModule.save();

    // Add module reference to course
    await Course.findByIdAndUpdate(courseId, {
      $push: { modules: savedModule._id },
    });

    res.status(201).json({ success: true, module: savedModule });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getModule = async (req, res) => {
  try {
    const { courseId } = req.params;

    const modules = await Module.find({ courseId }).populate("lessons");

    res.status(200).json({
      success: true,
      message: "Modules fetched successfully",
      data: modules,
    });
  } catch (error) {
    console.error("Error fetching modules:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching modules",
      error: error.message,
    });
  }
};

exports.createLesson = async (req, res) => {
  try {
    const {
      lessonTitle,
      lessonContent,
      lessonVideoSource,
      lessonImage,
      lessonHour,
      lessonMinute,
      lessonSecond,
      moduleId,
    } = req.body;

    const newLesson = new Lesson({
      lessonTitle,
      lessonContent,
      lessonVideoSource,
      lessonImage,
      lessonHour,
      lessonMinute,
      lessonSecond,
      module: moduleId,
    });

    const savedLesson = await newLesson.save();

    // Add lesson reference to module
    await Module.findByIdAndUpdate(moduleId, {
      $push: { lessons: savedLesson._id },
    });

    res.status(201).json({ success: true, lesson: savedLesson });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update Module
exports.updateModule = async (req, res) => {
  try {
    const { title } = req.body;

    const updatedModule = await Module.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true }
    );

    if (!updatedModule) {
      return res
        .status(404)
        .json({ success: false, message: "Module not found" });
    }

    res.status(200).json({
      success: true,
      message: "Module updated successfully",
      module: updatedModule,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update Lesson
exports.updateLesson = async (req, res) => {
  try {
    const {
      lessonTitle,
      lessonContent,
      lessonVideoSource,
      lessonImage,
      lessonHour,
      lessonMinute,
      lessonSecond,
    } = req.body;

    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      {
        lessonTitle,
        lessonContent,
        lessonVideoSource,
        lessonImage,
        lessonHour,
        lessonMinute,
        lessonSecond,
      },
      { new: true }
    );

    if (!updatedLesson) {
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found" });
    }

    res.status(200).json({
      success: true,
      message: "Lesson updated successfully",
      lesson: updatedLesson,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteModule = async (req, res) => {
  try {
    const { id } = req.params;

    // Find module
    const module = await Module.findById(id);
    if (!module) {
      return res.status(404).json({ success: false, message: "Module Not Found" });
    }

    // Delete all lessons inside the module
    await Lesson.deleteMany({ module: id });

    // Remove module reference from course
    await Course.findByIdAndUpdate(module.courseId, {
      $pull: { modules: id }, // ✅ correct field name
    });

    // Delete the module itself
    await Module.findByIdAndDelete(id); // ✅ correct way

    res.status(200).json({
      success: true,
      message: "Module and its lessons deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return res
        .status(404)
        .json({ success: false, message: "Lesson Not Found" });
    }

    // Remove Lesson Ref from its module
    await Module.findByIdAndUpdate(lesson.module, {
      $pull: { lesson: id },
    });

    // Delete course itself
    await Lesson.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Lesson deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
