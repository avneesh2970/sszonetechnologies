// src/courseUpload/LassonVideoPlayer.jsx
import React from "react";
import ReactPlayer from "react-player";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import LessonEditModal from "./LessonEdit";
import axios from "axios";
import { toast } from "react-toastify";

const LessonVideoPlayer = ({ lesson, modules, isOpen, onToggle }) => {
  // removed local showVideo state; now controlled by parent via isOpen/onToggle

  const formattedTime = `${lesson.lessonHour || 0}h ${
    lesson.lessonMinute || 0
  }m ${lesson.lessonSecond || 0}s`;

  return (
    <>
      <li className="rounded-lg   ">
  <div className="flex justify-between items-center">
    {/* Lesson title itself acts as button */}
    <div
      onClick={() => {
        onToggle();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className={`cursor-pointer transition ${
        isOpen
          ? "text-blue-600 font-semibold" // active (video visible)
          : "text-gray-800 hover:text-blue-500 font-medium" // inactive hover effect
      }`}
    >
      {lesson.lessonTitle}
    </div>
  </div>

  {/* Optional lesson content */}
  
</li>

    </>
  );
};

export default LessonVideoPlayer;
