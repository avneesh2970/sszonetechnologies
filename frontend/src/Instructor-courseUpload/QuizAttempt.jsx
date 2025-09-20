import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const StudentQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  // Fetch all quizzes
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/quiz/all`);
        setQuizzes(data.quizzes || []);
      } catch (err) {
        toast.error("Failed to fetch quizzes");
      }
    };
    fetchQuizzes();
  }, []);

  // Fetch selected quiz details
  useEffect(() => {
    if (!selectedQuizId) return;

    const fetchQuiz = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/quiz/${selectedQuizId}`
        );
        setQuiz(data.quiz);
        setAnswers(new Array(data.quiz.questions.length).fill(null));
        setResult(null);
      } catch (err) {
        toast.error("Failed to fetch quiz");
      }
    };
    fetchQuiz();
  }, [selectedQuizId]);

  // Submit quiz
  const handleSubmit = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/quiz/submit`,
        {
          quizId: selectedQuizId,
          answers,
        }
      );
      setResult(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit quiz");
    }
  };

  // If a quiz is selected, show attempt view
  if (selectedQuizId && quiz) {
    return (
      <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
        <button
          className="mb-4 text-blue-600 underline"
          onClick={() => setSelectedQuizId(null)}
        >
          ← Back to Quiz List
        </button>

        <h2 className="text-2xl font-bold mb-4">{quiz.title}</h2>

        {quiz.questions.map((q, qIndex) => (
          <div key={qIndex} className="mb-4">
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
          className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
        >
          Submit Quiz
        </button>

        {result && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold">
              Score: {result.score}/{result.total}
            </h3>
            {result.results.map((r, i) => (
              <p
                key={i}
                className={r.isCorrect ? "text-green-600" : "text-red-600"}
              >
                Q{i + 1}: {r.isCorrect ? "✅ Correct" : `❌ Wrong (Correct: ${r.correct})`}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Show quiz list
  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Available Quizzes</h2>
      {quizzes.length === 0 && <p>No quizzes available.</p>}
      <ul>
        {quizzes.map((quiz) => (
          <li
            key={quiz._id}
            onClick={() => setSelectedQuizId(quiz._id)}
            className="cursor-pointer border p-3 mb-2 rounded hover:bg-gray-100"
          >
            {quiz.title}{" "}
            <span className="text-sm text-gray-500">
              ({quiz.moduleId?.title})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentQuiz;
