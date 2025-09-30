import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddAssignment = ({ courseId, onSuccess , onClose }) => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [questions, setQuestions] = useState([{ questionText: "" }]);
  const [loading, setLoading] = useState(false);

  
  const [modules, setModules] = useState([]);
   const [selectedModule, setSelectedModule] = useState("");

  const fetchModules = async () => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/course-structure/module/${courseId}`
      );
      setModules(res.data.modules || res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  // ➕ Add new question field
  const addQuestion = () => {
    setQuestions([...questions, { questionText: "" }]);
  };

  // 📝 Handle input change for questions
  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].questionText = value;
    setQuestions(updated);
  };

  // 🚀 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/assignments`,
        {
          moduleId : selectedModule,
          title,
          summary,
          questions,
        }
      );

      toast.success("✅ Assignment added successfully");
      setTitle("");
      setSummary("");
      setQuestions([{ questionText: "" }]);

      if (onSuccess) onSuccess(res.data.assignment); // callback to parent
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add assignment");
    } finally {
      setLoading(false);
    }
  };  


  return (
    <div className="max-w-3xl mx-auto space-y-8 ">
        <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-3">Add Assignment</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="border p-2 w-full rounded"
            >
              <option value="">-- Select Module for quiz --</option>
              {modules.map((mod) => (
                <option key={mod._id} value={mod._id}>
                  {mod.title}
                </option>
              ))}
            </select>

        <div>
          <label className="block text-sm font-medium">Assignment Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-medium">Summary</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Questions */}
        <div>
          <label className="block text-sm font-medium">Questions</label>
          {questions.map((q, index) => (
            <input
              key={index}
              type="text"
              value={q.questionText}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
              placeholder={`Question ${index + 1}`}
              className="w-full p-2 border rounded-md mt-2"
            />
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="mt-2 px-3 py-1 text-sm bg-gray-200 rounded-md"
          >
            ➕ Add Question
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Save Assignment"}
        </button>
      </form>
      </div>
    </div>
  );
};

export default AddAssignment;
