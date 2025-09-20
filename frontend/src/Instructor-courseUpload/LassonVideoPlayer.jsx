import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import LessonEditModal from "./LessonEdit";
import axios from "axios";
import { toast } from "react-toastify";

const LessonVideoPlayer = ({ lesson, modules , onLessonDeleted }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [localModules, setLocalModules] = useState(modules);

  useEffect(() => {
    setLocalModules(modules);
  }, [modules]);

  const handleEditClick = (lesson) => {
    setEditingLesson(lesson);
  };

  const handleLessonUpdate = (updatedLesson) => {
    const updatedModules = localModules.map((mod) => ({
      ...mod,
      lessons: mod.lessons.map((l) =>
        l._id === updatedLesson._id ? updatedLesson : l
      ),
    }));
    setLocalModules(updatedModules);
    setEditingLesson(null);
  };

  

   const handleDeleteLesson = async (lessonId) => {
  if (window.confirm("Are you sure you want to delete this lesson?")) {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/course-structure/lesson/${lessonId}`,
        { withCredentials: true }
      );

      toast.success("Lesson deleted successfully 🎉");

      if (onLessonDeleted) {
        onLessonDeleted(lessonId); // notify parent
      }
    } catch (error) {
      toast.error("Failed to delete lesson 😢");
      console.error(error);
    }
  }
};


  const formattedTime = `${lesson.lessonHour || 0}h ${
    lesson.lessonMinute || 0
  }m ${lesson.lessonSecond || 0}s`;

  return (
    <>
      <li className="bg-white rounded-lg shadow-sm p-4 my-4">
        {/* Title and Buttons */}
        <div className="flex justify-between items-center">
          <div className=" font-semibold text-gray-800">
            {lesson.lessonTitle}
            <span className="text-sm text-gray-500 ml-2">
              ({formattedTime})
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleEditClick(lesson)}
              className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
            >
              <FiEdit />
              <span>Edit</span>
            </button>
            <button
              onClick={() => handleDeleteLesson(lesson._id)}
              className="text-red-500 hover:text-red-700 flex items-center gap-1"
            >
              <FiTrash2 />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <p className="text-gray-600 mt-2">{lesson.lessonContent}</p>

        {/* Video Toggle */}
        <button
          onClick={() => setShowVideo(!showVideo)}
          className="mt-3 text-white bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded-md text-sm"
        >
          {showVideo ? "Hide Video" : "Watch Course Video"}
        </button>

        {/* Video */}
        {showVideo && (
          <div className="mt-4">
            {lesson.lessonVideoSource &&
            ReactPlayer.canPlay(lesson.lessonVideoSource) ? (
              <ReactPlayer
                url={lesson.lessonVideoSource}
                controls
                width="100%"
                height="360px"
                style={{ borderRadius: "10px", overflow: "hidden" }}
              />
            ) : (
              <p className="text-red-500 text-sm mt-2">
                ⚠️ Invalid or missing video URL.
              </p>
            )}
          </div>
        )}
      </li>

      {/* Edit Modal */}
      {editingLesson && (
        <LessonEditModal
          lesson={editingLesson}
          onClose={() => setEditingLesson(null)}
          onLessonUpdated={handleLessonUpdate}
        />
      )}
    </>
  );
};

export default LessonVideoPlayer;
