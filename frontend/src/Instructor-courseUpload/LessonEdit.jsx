import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";

const LessonEditModal = ({ lesson, onClose, onLessonUpdated }) => {
  const [lessonForm, setLessonForm] = useState({
    lessonTitle: "",
    lessonContent: "",
    lessonVideoSource: "",
    lessonImage: "",
    lessonHour: "",
    lessonMinute: "",
    lessonSecond: "",
  });

  // Prefill when lesson changes
  useEffect(() => {
    if (lesson) {
      setLessonForm({
        lessonTitle: lesson.lessonTitle || "",
        lessonContent: lesson.lessonContent || "",
        lessonVideoSource: lesson.lessonVideoSource || "",
        lessonImage: lesson.lessonImage || "",
        lessonHour: lesson.lessonHour || "",
        lessonMinute: lesson.lessonMinute || "",
        lessonSecond: lesson.lessonSecond || "",
      });
    }
  }, [lesson]);

  const handleChangeLesson = (e) => {
    setLessonForm({ ...lessonForm, [e.target.name]: e.target.value });
  };

  const handleSubmitLesson = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/course-structure/lesson/${lesson._id}`,
        lessonForm
      );
      toast.success("✅ Lesson updated!");
      if (onLessonUpdated) onLessonUpdated(res.data.lesson);
      onClose(); // Close modal after save
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to update lesson");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200 bg-opacity-40">
      <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-lg relative">
        <h2 className="text-xl font-bold mb-4">✏️ Edit Lesson</h2>

        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          <AiOutlineClose size={22} />
        </button>

        <form onSubmit={handleSubmitLesson} className="space-y-4">
          <input
            name="lessonTitle"
            value={lessonForm.lessonTitle}
            onChange={handleChangeLesson}
            className="w-full border p-2 rounded"
            placeholder="Title"
          />

          <textarea
            name="lessonContent"
            value={lessonForm.lessonContent}
            onChange={handleChangeLesson}
            className="w-full border p-2 rounded"
            rows={4}
            placeholder="Content"
          />

          <input
            name="lessonVideoSource"
            value={lessonForm.lessonVideoSource}
            onChange={handleChangeLesson}
            className="w-full border p-2 rounded"
            placeholder="Video URL"
          />

          <div className="flex gap-4">
            <input
              name="lessonHour"
              type="number"
              value={lessonForm.lessonHour}
              onChange={handleChangeLesson}
              className="w-1/3 border p-2 rounded"
              placeholder="Hours"
            />
            <input
              name="lessonMinute"
              type="number"
              value={lessonForm.lessonMinute}
              onChange={handleChangeLesson}
              className="w-1/3 border p-2 rounded"
              placeholder="Minutes"
            />
            <input
              name="lessonSecond"
              type="number"
              value={lessonForm.lessonSecond}
              onChange={handleChangeLesson}
              className="w-1/3 border p-2 rounded"
              placeholder="Seconds"
            />
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
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
