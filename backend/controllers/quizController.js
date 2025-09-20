const Quiz = require("../models/quizModel");
const Module = require("../models/Module");
const Course = require('../models/CourseModel-instructor')
const QuizAttempt = require("../models/quizAttemptModel");
const { default: mongoose } = require("mongoose");

// 📌 Create a quiz for a module
exports.createQuiz = async (req, res) => {
  try {
    const { moduleId, title, questions } = req.body;

    const quiz = new Quiz({ moduleId, title, questions });
    await quiz.save();

    // push quiz reference to module
    await Module.findByIdAndUpdate(moduleId, { $push: { quizzes: quiz._id } });

    res.status(201).json({ success: true, quiz });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Get quiz for course (ye vo quiz show karega jo use course se related ho )
exports.getQuizzesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params; 

    // 1. Get all modules of this course
    const modules = await Module.find({ courseId }).select("_id");
    const moduleIds = modules.map((m) => m._id);

    // 2. Find all quizzes linked to those modules
    const quizzes = await Quiz.find({ moduleId: { $in: moduleIds } })
      .populate({
        path: "moduleId",
        select: "title courseId",
        populate: {
          path: "courseId",
          select: "title",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, quizzes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// add single/multiple questions into quiz
exports.addQuestions = async (req, res) => {
  try {
    const { quizId, questions } = req.body;
    // questions = [{ questionText, options: [], correctAnswer }]

    if (!quizId || !questions) {
      return res
        .status(400)
        .json({ success: false, message: "quizId and questions are required" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }

    // push multiple questions
    quiz.questions.push(...questions);
    await quiz.save();

    res.status(200).json({ success: true, quiz });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}; 

exports.getInstructorQuizzes = async (req, res) => {
  try {
    const instructorId = req.instructorId;

    // 1. Get courses created by this instructor
    const courses = await Course.find({ instructor: req.instructorId }).select("_id title");
    const courseIds = courses.map((c) => c._id);

    // 2. Get modules of these courses
    const modules = await Module.find({ courseId: { $in: courseIds } }).select("_id");
    const moduleIds = modules.map((m) => m._id);

    // 3. Get quizzes inside those modules
    const quizzes = await Quiz.find({ moduleId: { $in: moduleIds } })
      .populate({
        path: "moduleId",
        select: "title courseId",
        populate: {
          path: "courseId",
          select: "title instructorId",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      quizzes,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Get all quizzes by moduleId  (student can see all quiz and attend quiz)
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      // .populate("moduleId", "title")
      .populate({
        path: "moduleId",
        select: "title courseId", // get module title + courseId
        populate: {
          path: "courseId",
          select: "title", // only bring course title
        },
      }).sort({createdAt : -1})
    res.status(200).json({ success: true, quizzes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const studentId = req.user.id; 

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }

    let score = 0;
    const results = quiz.questions.map((q, index) => {
      const isCorrect = answers[index] === q.correctAnswer;
      if (isCorrect) score++;
      return {
        questionId: q._id,
        selected: answers[index],
        correct: q.correctAnswer,
        isCorrect,
      };
    });

    // Save attempt
    const attempt = new QuizAttempt({
      studentId: req.user.id,
      quizId,
      answers: results,
      score,
      total: quiz.questions.length,
    });
    await attempt.save();

    await attempt.save();

    res.status(200).json({
      success: true,
      score,
      total: quiz.questions.length,
      results,
      attemptId: attempt._id,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// fetch all attempts of a student.
exports.getMyAttempts = async (req, res) => {
  try {
    const studentId = new mongoose.Types.ObjectId(req.user.id);

    const attempts = await QuizAttempt.find({ studentId })
      .populate({
        path: "quizId",
        populate: {
          path: "moduleId",
          populate: {
            path: "courseId", // <- this ensures courseId is populated
            select: "title",  // only fetch course title
          },
        },
      })
      .sort({ attemptedAt: -1 });

    res.status(200).json({ success: true, attempts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Useful if a student wants to see answers + corrections.
exports.getAttemptById = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await QuizAttempt.findById(attemptId).populate(
      "quizId",
      "title"
    );

    if (!attempt) {
      return res
        .status(404)
        .json({ success: false, message: "Attempt not found" });
    }

    // Optional: verify that attempt belongs to the logged-in student
    if (attempt.studentId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    res.status(200).json({ success: true, attempt });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get single quiz with its questions
exports.getQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId).populate("moduleId", "title");

    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }

    res.status(200).json({ success: true, quiz });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
