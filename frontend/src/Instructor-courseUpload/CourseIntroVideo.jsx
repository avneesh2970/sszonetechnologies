import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CourseIntroVideo = ({ courseId }) => {
  const [videoUrl, setVideoUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoUrl) return toast.error("Please enter a video URL");

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/course-intro-video/create`, {
        courseId,
        videoUrl,
        title: "Intro Video", // Optional default title
      });

      toast.success(res.data.message || "Intro video added successfully!");
      setVideoUrl(""); // reset input
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error adding intro video");
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 mt-8 max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <summary className="text-xl font-semibold cursor-pointer text-blue-700"> 🎥 Add Course Intro Video </summary>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Paste video URL here"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            required
          />
          <p className="text-xs text-gray-500 "> Paste any public video URL. </p>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Upload Video
          </button>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default CourseIntroVideo;
