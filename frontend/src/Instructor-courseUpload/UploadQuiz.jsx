import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import AddQuestionsForm from "./AddQuestion";

const UploadQuiz = ({ courseId }) => {
  const [selectedModule, setSelectedModule] = useState("");
  const [title, setTitle] = useState("");
  const [modules, setModules] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedModule) {
      toast.error("Please select a module");
      return;
    }
    if (!title.trim()) {
      toast.error("Quiz title is required");
      return;
    }

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/quiz`,
        {
          moduleId: selectedModule,
          title,
        }
      );

      toast.success("Quiz created successfully!");
      setTitle("");
      setSelectedModule("");

      // if (onQuizAdded) onQuizAdded(data.quiz); // ✅ callback to parent
    } catch (err) {
      console.error("Error creating quiz:", err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
          {" "}
          📘 Add quiz
        </h2>
          <form onSubmit={handleSubmit} className="space-y-4 ">
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

            <input
              type="text"
              placeholder="Quiz Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 w-full rounded"
            />

            <div className="flex justify-end gap-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Create Quiz
              </button>
              <button
                onClick={() => setIsOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add Question
              </button>
            </div>
          </form>

          {/* Modal */}
          {isOpen && (
            <div className="fixed inset-0 bg-gray-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl"
                >
                  ✖
                </button>

                <AddQuestionsForm courseId={courseId} />
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer autoClose={1000}/>
    </>
  );
};

export default UploadQuiz;
