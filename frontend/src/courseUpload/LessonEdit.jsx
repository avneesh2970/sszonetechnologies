import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";


const LessonEditModal = ({ lesson, onClose, onLessonUpdated }) => {
  const [formData, setFormData] = useState({ ...lesson });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/lessons/${lesson._id}`,
        formData
      );
      toast.success("✅ Lesson updated!");
      onLessonUpdated(res.data); // pass back updated lesson
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update lesson");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200 bg-opacity-40">
      <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-lg relative">
        <h2 className="text-xl font-bold mb-4">✏️ Edit Lesson</h2>

        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
           <AiOutlineClose size={22} />
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="lessonTitle"
            value={formData.lessonTitle}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Title"
          />

          <textarea
            name="lessonContent"
            value={formData.lessonContent}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={4}
            placeholder="Content"
          />

          <input
            name="lessonVideoSource"
            value={formData.lessonVideoSource}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Video URL"
          />

          <div className="flex gap-4">
            <input
              name="lessonHour"
              type="number"
              value={formData.lessonHour}
              onChange={handleChange}
              className="w-1/3 border p-2 rounded"
              placeholder="Hours"
            />
            <input
              name="lessonMinute"
              type="number"
              value={formData.lessonMinute}
              onChange={handleChange}
              className="w-1/3 border p-2 rounded"
              placeholder="Minutes"
            />
            <input
              name="lessonSecond"
              type="number"
              value={formData.lessonSecond}
              onChange={handleChange}
              className="w-1/3 border p-2 rounded"
              placeholder="Seconds"
            />
          </div>

          <div className="text-right">
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </form>

        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </div>
  );
};

export default LessonEditModal;
