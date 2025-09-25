// export default InstructorMyQuiz;

import React, { useEffect, useState } from "react";
import axios from "axios";

const InstructorMyQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/quiz/instructor`, {
        withCredentials: true,
      })
      .then((res) => {
        setQuizzes(res.data.quizzes);
      })
      .catch((err) => {
        console.error("Error fetching quizzes", err);
      });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4"> My Quizzes</h2>
      <table className="w-full border border-gray-300 rounded-lg">
        <thead className="bg-blue-100 border-b border-gray-300">
          <tr className="text-left">
            <th className="p-2 border border-gray-300">#</th>
            <th className="p-2 border border-gray-300">Course</th>
            <th className="p-2 border border-gray-300">Module</th>
            <th className="p-2 border border-gray-300">Quiz Title</th>
            <th className="p-2 border border-gray-300">Questions</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {quizzes.map((quiz, index) => (
            <tr key={quiz._id} className="hover:bg-blue-50 transition-colors">
              <td className="p-2 border border-gray-300">{index + 1}</td>
              <td className="p-2 border border-gray-300">
                {quiz.moduleId?.courseId?.title || "—"}
              </td>
              <td className="p-2 border border-gray-300">
                {quiz.moduleId?.title || "—"}
              </td>
              <td className="p-2 border border-gray-300">{quiz.title}</td>
              <td className="p-2 border border-gray-300">
                <button
                  onClick={() => setSelectedQuiz(quiz)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  View Questions
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup Modal */}
      {selectedQuiz && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-60">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg">
            <h3 className="text-xl font-semibold mb-3">
              {/* {selectedQuiz.title} — Questions */}
              {selectedQuiz.questions?.length > 0 && `${selectedQuiz.title}`}
            </h3>

            <ul className="space-y-3 max-h-96 overflow-y-auto">
              {selectedQuiz.questions?.length > 0 ? (
                selectedQuiz.questions.map((q, i) => (
                  <li key={i} className="border p-3 rounded">
                    <p className="font-medium">{q.question}</p>
                    <ul className="mt-2 ml-4 list-disc">
                      {q.options.map((opt, oi) => (
                        <li
                          key={oi}
                          className={
                            oi === q.correctAnswer
                              ? "text-green-600 font-medium"
                              : ""
                          }
                        >
                          {opt}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))
              ) : (
                <p className="flex justify-center items-center text-lg font-semibold">
                  There are no questions
                </p>
              )}
            </ul>

            <div className="mt-4 text-right">
              <button
                onClick={() => setSelectedQuiz(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorMyQuiz;
