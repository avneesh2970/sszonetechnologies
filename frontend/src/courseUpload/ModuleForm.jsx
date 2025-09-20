import React, { useState } from "react";
import axios from "axios";

const ModuleForm = ({ courseId, onModuleCreated }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/modules`, {
        title,
        courseId,
      });
      setTitle("");
      // onModuleCreated(); // Refresh module list
    } catch (err) {
      console.error("❌ Error creating module:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto mt-10 border border-gray-200"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📦 Create Module</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Module Title
          </label>
          <input
            type="text"
            placeholder="e.g. React Basics"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Add Module
          </button>
        </div>
      </div>
    </form>
  );
};

export default ModuleForm;
