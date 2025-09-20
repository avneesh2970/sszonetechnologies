import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CourseIntroVideo = ({ courseId, onUploaded }) => {
  const [videoUrl, setVideoUrl] = useState("");

  const handleUploadVideo = async () => {
    if (!courseId) {
      toast.error("❌ Course ID is missing.");
      return;
    }

    if (!videoUrl.trim()) {
      toast.warn("⚠️ Please enter a video URL.");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/courses/${courseId}/upload-video`, {
        videoUrl,
      });

      toast.success("✅ Video URL uploaded successfully!");
      setVideoUrl("");
      if (onUploaded) onUploaded();
    } catch (err) {
      console.error("Upload Error:", err);
      toast.error("❌ Failed to upload video.");
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 mt-8 max-w-3xl mx-auto">
        <details open>
          <summary className="text-xl font-semibold cursor-pointer text-blue-700">
            🎥 Add Course Intro Video
          </summary>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video URL
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="e.g. https://example.com/video.mp4"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
              />
              <p className="text-xs text-gray-500 mt-1">
                Paste any public video URL.
              </p>
            </div>

           <div className="text-right">
             <button
              onClick={handleUploadVideo}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Upload Video
            </button>
           </div>
          </div>
        </details>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default CourseIntroVideo;
