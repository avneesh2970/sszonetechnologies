import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddQuestionsForm = ({ courseId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  // ✅ Fetch all quizzes for dropdown
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const { data } = await axios.get(
          // `${import.meta.env.VITE_BACKEND_URL}/api/quiz/all`     //Get all Quiz 
          `${import.meta.env.VITE_BACKEND_URL}/api/quiz/quizzes/course/${courseId}`   //Quiz related to course 
        );
        setQuizzes(data.quizzes || []);
        console.log("data", data);
      } catch (err) {
        toast.error("Failed to fetch quizzes");
      }
    };
    fetchQuizzes();
  }, []);

  // ✅ Add question handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedQuiz) {
      toast.error("Please select a quiz");
      return;
    }
    if (!question.trim()) {
      toast.error("Question text is required");
      return;
    }
    if (options.some((opt) => !opt.trim())) {
      toast.error("All options are required");
      return;
    }
    if (correctAnswer === null) {
      toast.error("Please select the correct answer");
      return;
    }

    try {
      const payload = {
        quizId: selectedQuiz,
        questions: [
          {
            question,
            options,
            correctAnswer,
          },
        ],
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/quiz/add-questions`,
        payload
      );

      toast.success("Question added successfully!");
      console.log("Updated Quiz:", data.quiz);

      // Reset form
      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add question");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Add Question to Quiz</h2>

      {/* Quiz Dropdown */}
      <label className="block mb-2 font-medium">Select Quiz</label>
      <select
        value={selectedQuiz}
        onChange={(e) => setSelectedQuiz(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      >
        <option value="">-- Select Quiz --</option>
        {quizzes.map((quiz) => (
          <option key={quiz._id} value={quiz._id}>
            {quiz.title} ({quiz.moduleId?.title})
          </option>
        ))}
      </select>

      {/* Question Input */}
      <label className="block mb-2 font-medium">Question</label>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Enter your question"
        className="w-full border p-2 rounded mb-4"
      />

      {/* Options */}
      <label className="block mb-2 font-medium">Options</label>
      {options.map((opt, idx) => (
        <div key={idx} className="flex items-center mb-2">
          <input
            type="text"
            value={opt}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[idx] = e.target.value;
              setOptions(newOptions);
            }}
            placeholder={`Option ${idx + 1}`}
            className="flex-1 border p-2 rounded"
          />
          <input
            type="radio"
            name="correctAnswer"
            checked={correctAnswer === idx}
            onChange={() => setCorrectAnswer(idx)}
            className="ml-2"
          />
          <span className="ml-1 text-sm">Correct</span>
        </div>
      ))}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700"
      >
        Add Question
      </button>
    </div>
  );
};

export default AddQuestionsForm;
