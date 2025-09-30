import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BiAlignLeft } from "react-icons/bi";
import { FaArrowLeft } from "react-icons/fa";

const StudentQuiz = () => {
  const [view, setView] = useState("list"); // "list" | "attempt" | "history" | "details"
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ for submit button loading
  const [showResultPopup, setShowResultPopup] = useState(false); // ✅ for result popup


  // Fetch all quizzes
  useEffect(() => {
    if (view === "list") {
      const fetchQuizzes = async () => {
        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/quiz/all`
          );
          setQuizzes(data.quizzes || []);
        } catch (err) {
          toast.error("Failed to fetch quizzes");
        }
      };
      fetchQuizzes();
    }
  }, [view]);

  // Fetch history
  useEffect(() => {
    if (view === "history") {
      const fetchHistory = async () => {
        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/quiz/my-attempts`,
            {
              withCredentials: true,
            }
          );
          setHistory(data.attempts || []);
          console.log("data", data);
        } catch (err) {
          toast.error("Failed to fetch history");
          console.log("faild to fetch History", err);
        }
      };
      fetchHistory();
    }
  }, [view]);

  // Fetch attempt details
  const fetchAttemptDetails = async (attemptId) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/quiz/attempt/${attemptId}`,
        {
          withCredentials: true,
        }
      );
      setSelectedAttempt(data.attempt);
      setView("details");
    } catch (err) {
      toast.error("Failed to fetch attempt details");
    }
  };

  // Start quiz
  const startQuiz = async (quizId) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/quiz/${quizId}`
      );
      setSelectedQuiz(data.quiz);
      setAnswers(new Array(data.quiz.questions.length).fill(null));
      setResult(null);
      setView("attempt");
    } catch (err) {
      toast.error("Failed to fetch quiz");
    }
  };

  // Submit quiz
  const handleSubmit = async () => {
    setLoading(true)
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/quiz/submit`,
        {
          quizId: selectedQuiz._id,
          answers,
        },
        { withCredentials: true }
      );
      setResult(data);
      setShowResultPopup(true) // Shop Popup
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit quiz");
    }finally {
      setLoading(false)
    }
  };

  const handleCloseResultPopup = () => {
    setShowResultPopup(false);
    setSelectedQuiz(null);
    setAnswers([]);
    setResult(null);
    setView("list"); // ✅ go back to quiz list
  };

  // ---------------- QUIZ LIST ----------------
  if (view === "list") {
    return (
      <div className="p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Quizzes</h2>
        <button
          onClick={() => setView("history")}
          className="mb-4 bg-gray-500 text-white px-3 py-1 rounded"
        >
          View My Quiz History
        </button>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-blue-100 text-left">
            <tr>
              <th className="px-4 py-2 border border-gray-300 ">Quiz Title</th>
              <th className="px-4 py-2 border border-gray-300">Module Title</th>
              <th className="px-4 py-2 border border-gray-300">Course Title</th>
              <th className="px-4 py-2 border border-gray-300">No. of Questions</th>
              <th className="px-4 py-2 border border-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz, index) => (
              <tr
                key={quiz._id}
                className={` border bg-white ${
                  index % 2 === 1 ? "" : ""
                } hover:bg-blue-50`}
              >
                <td className="px-4 py-2 border border-gray-300">{quiz.title}</td>
                <td className="px-4 py-2 border border-gray-300">
                  {quiz.moduleId?.title || "-"}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {quiz.moduleId?.courseId?.title || "-"}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {quiz.questions?.length || 0}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <button
                    onClick={() => startQuiz(quiz._id)}
                    className="bg-blue-600 text-sm text-white px-2 py-1 rounded hover:bg-blue-700"
                  >
                    Attempt Quiz
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // ---------------- QUIZ ATTEMPT ----------------
  if (view === "attempt") {
    return (
      <div className="p-6">
        <button
          onClick={() => setView("list")}
          className="mb-4 text-blue-600 underline"
        >
          ← Back to Quiz List
        </button>
        <h2 className="text-2xl font-bold mb-4">{selectedQuiz.title}</h2>
        {selectedQuiz.questions.map((q, qIndex) => (
          <div key={qIndex} className="mb-4 p-3 border rounded">
            <p className="font-semibold">
              {qIndex + 1}. {q.question}
            </p>
            {q.options.map((opt, oIndex) => (
              <label key={oIndex} className="block">
                <input
                  type="radio"
                  name={`q-${qIndex}`}
                  checked={answers[qIndex] === oIndex}
                  onChange={() => {
                    const newAns = [...answers];
                    newAns[qIndex] = oIndex;
                    setAnswers(newAns);
                  }}
                />
                <span className="ml-2">{opt}</span>
              </label>
            ))}
          </div>
        ))}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded mt-2 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Quiz"}
        </button>

        {/* ✅ RESULT POPUP */}
        {showResultPopup && result && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-200 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-xl font-bold mb-2 text-center">
                Quiz Result
              </h3>
              <p className="text-center font-semibold mb-4">
                Score: {result.score}/{result.total}
              </p>
              <div className="max-h-60 overflow-y-auto mb-4">
                {result.results.map((r, i) => (
                  <p
                    key={i}
                    className={r.isCorrect ? "text-green-600" : "text-red-600"}
                  >
                    Q{i + 1}:{" "}
                    {r.isCorrect
                      ? "✅ Correct"
                      : `❌ Wrong `}
                      {/* : `❌ Wrong (Correct: ${r.correct})`} */}
                  </p>
                ))}
              </div>
              <button
                onClick={handleCloseResultPopup}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded w-full"
              >
                Back to All Quizzes
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
      
   

  // ---------------- QUIZ HISTORY ----------------
  if (view === "history") {
    return (
      <div className="p-6">
        <button
          onClick={() => setView("list")}
          className="mb-4 text-blue-600 flex items-center gap-1 "
        >
         <FaArrowLeft/> Back
        </button>
        <h2 className="text-2xl font-bold mb-4">My Quiz History</h2>
        {history.length === 0 ? (
          <p>No attempts yet.</p>
        ) : (
          <table className="min-w-full border-gray-300">
            <thead>
              <tr className="bg-blue-100 border-gray-300">
                <th className="p-3 text-left border border-gray-300">#</th>
                <th className="p-3 text-left border border-gray-300">Quiz Title</th>
                <th className="p-3 text-left border border-gray-300">Module</th>
                <th className="p-3 text-left border border-gray-300">Course</th>
                <th className="p-3 text-left border border-gray-300">Score</th>
                <th className="p-3 text-left border border-gray-300">Attempted At</th>
                <th className="p-3 text-left border border-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, index) => (
                <tr
                  key={h._id}
                  className={`border hover:bg-blue-100 bg-white `}
                >
                  <td className="p-3 border border-gray-300">{index + 1}</td>
                  <td className="p-3  border border-gray-300">
                    {h.quizId?.title || "Untitled Quiz"}
                  </td>
                  <td className="p-3 border border-gray-300">{h.quizId?.moduleId?.title || "-"}</td>
                  <td className="p-3 border border-gray-300">
                    {h.quizId?.moduleId?.courseId?.title || "-"}
                  </td>
                  <td className="p-3 border border-gray-300">
                    {h.score} / {h.total}
                  </td>
                  <td className="p-3 border border-gray-300 text-gray-600 text-sm">
                    {new Date(h.attemptedAt).toLocaleString()}
                  </td>
                  <td className="p-3 border border-gray-300">
                    <button
                      onClick={() => fetchAttemptDetails(h._id)}
                      className="bg-blue-600 text-white px-3 py-1 border border-gray-300 rounded hover:bg-blue-700"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  // ---------------- ATTEMPT DETAILS ----------------
  if (view === "details" && selectedAttempt) {
    return (
      <div className="p-6">
        <button
          onClick={() => setView("history")}
          className="mb-4 text-blue-600 flex items-center gap-1 "
        >
          <FaArrowLeft/> Back
        </button>

        <h2 className="text-2xl font-bold mb-2">
          {selectedAttempt.quizId?.title || "Untitled Quiz"}
        </h2>

        <p className="mb-4 font-medium">
          Score: {selectedAttempt.score}/{selectedAttempt.total}
        </p>

        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Your Answer</th>
              <th className="px-4 py-2 border">Correct Answer</th>
              <th className="px-4 py-2 border">Result</th>
            </tr>
          </thead>
          <tbody>
            {selectedAttempt.answers.map((ans, i) => (
              <tr
                key={i}
                className={`border text-center ${
                  ans.isCorrect ? "bg-green-100" : "bg-red-100"
                  
                }`}
              >
                <td className="px-4 py-2 border">{i + 1}</td>
                <td className="px-4 py-2 border">
                  {ans.selected || "Not Answered"}{ans.question }
                </td>
                <td className="px-4 py-2 border">{ans.correct}</td>
                <td className="px-4 py-2 border font-semibold">
                  {ans.isCorrect ? "Correct" : "Wrong"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
};

export default StudentQuiz;
