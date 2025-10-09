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
      <li className=" rounded-lg border-b p-4 my-4">
        {/* Title and Buttons */}
        <div className="flex justify-between items-center">
          <div className="font-semibold text-lg text-gray-800">
            {lesson.lessonTitle}
            {/* <span className="text-sm text-gray-500 ml-2">
              ({formattedTime})
            </span> */}
          </div>
          
        </div>

        {/* Content */}
        <p className="text-gray-600 my-1">{lesson.lessonContent}</p>

        {/* Video Toggle */}
        <button
          onClick={()=>{
            onToggle() , scrollTo(0 , 0) }}
          className=" text-white bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded-md text-sm"
        >
          {isOpen ? "Hide Video" : "Watch Course Video"}
        </button>

        {/* Video (kept - will still show inside the lesson list when isOpen true) */}
        {/* {isOpen && (
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
        )} */}
      </li>
    </>
  );
};

export default LessonVideoPlayer;
