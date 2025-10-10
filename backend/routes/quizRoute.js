
const express = require("express");
const auth = require("../middleware/auth");  //This is for student 
const authMiddleware = require('../middleware/instructor')
const {
  createQuiz,
  addQuestions,
  getAllQuizzes,
  submitQuiz,
  getQuizById,
  getAttemptById,
  getMyAttempts,
  getQuizzesByCourse,
  getInstructorQuizzes,
  attemptQuiz,
} = require("../controllers/quizController");


const router = express.Router();

// create quiz for a module
router.post("/", createQuiz);

// add question(s) to an existing quiz
router.post("/add-questions", addQuestions);

// get quiz by course 
router.get("/quizzes/course/:courseId", getQuizzesByCourse);

// get all quizzes of a module
router.get("/all", getAllQuizzes);


router.get("/instructor", authMiddleware, getInstructorQuizzes);


// ✅ put this BEFORE dynamic :quizId
router.get("/my-attempts", auth, getMyAttempts);




// ✅ attempt by id (specific)
router.get("/attempt/:attemptId", auth, getAttemptById);

// dynamic quiz by id (keep last)
router.get("/:quizId", getQuizById);


// i am using 2 diff api to submit quiz form , submit is used in student dashboard quiz section
//                                              and attempt is used in website both are working prpperly 
router.post("/submit", auth, submitQuiz);
// // this if for quiz attempt in main course
router.post("/attempt", auth, attemptQuiz);

module.exports = router;
