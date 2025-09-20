import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LessonForm = ({ modules, onLessonAdded }) => {
  const [formData, setFormData] = useState({
    lessonTitle: "",
    lessonContent: "",
    lessonImage: "",
    lessonVideoSource: "",
    lessonHour: 0,
    lessonMinute: 0,
    lessonSecond: 0,
    moduleId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const {
      lessonTitle,
      lessonContent,
      lessonVideoSource,
      lessonHour,
      lessonMinute,
      lessonSecond,
      moduleId,
    } = formData;

    if (
      !lessonTitle.trim() ||
      !lessonContent.trim() ||
      !lessonVideoSource.trim() ||
      !moduleId
    ) {
      toast.error("❌ Please fill out all required fields.");
      return false;
    }

    if (
      Number(lessonHour) < 0 ||
      Number(lessonMinute) < 0 ||
      Number(lessonSecond) < 0
    ) {
      toast.error("❌ Duration values must be non-negative.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { moduleId, ...lessonData } = formData;

    if (!validateForm()) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/modules/${moduleId}/lessons`,
        lessonData
      );

      onLessonAdded(res.data.lesson);
      toast.success("✅ Lesson added successfully!");

      setFormData({
        lessonTitle: "",
        lessonContent: "",
        lessonImage: "",
        lessonVideoSource: "",
        lessonHour: 0,
        lessonMinute: 0,
        lessonSecond: 0,
        moduleId: "",
      });
    } catch (err) {
      toast.error("❌ Error adding lesson. Check console.");
      console.error(err);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 mt-10 rounded-xl shadow-lg max-w-3xl mx-auto border border-gray-200 space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800">📚 Add Lesson</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Module
          </label>
          <select
            name="moduleId"
            onChange={handleChange}
            value={formData.moduleId}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">-- Choose Module --</option>
            {modules.map((mod) => (
              <option key={mod._id} value={mod._id}>
                {mod.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lesson Title
          </label>
          <input
            name="lessonTitle"
            placeholder="e.g. Introduction to Components"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
            value={formData.lessonTitle}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lesson Content
          </label>
          <textarea
            name="lessonContent"
            placeholder="Write lesson content here..."
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
            value={formData.lessonContent}
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Video URL
          </label>
          <input
            name="lessonVideoSource"
            placeholder="e.g. https://www.youtube.com/watch?v=xyz"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
            value={formData.lessonVideoSource}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>
          <div className="flex gap-4">
            <input
              name="lessonHour"
              type="number"
              placeholder="Hours"
              className="w-1/3 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
              value={formData.lessonHour}
            />
            <input
              name="lessonMinute"
              type="number"
              placeholder="Minutes"
              className="w-1/3 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
              value={formData.lessonMinute}
            />
            <input
              name="lessonSecond"
              type="number"
              placeholder="Seconds"
              className="w-1/3 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
              value={formData.lessonSecond}
            />
          </div>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Add Lesson
          </button>
        </div>
      </form>

      <ToastContainer position="top-right" autoClose={2000}   closeOnClick />
    </>
  );
};

export default LessonForm;
