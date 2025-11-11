// import React, { useState } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const CourseIntroVideo = ({ courseId }) => {
//   const [videoUrl, setVideoUrl] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!videoUrl) return toast.error("Please enter a video URL");

//     try {
//       const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/course-intro-video/create`, {
//         courseId,
//         videoUrl,
//         title: "Intro Video", // Optional default title
//       });

//       toast.success(res.data.message || "Intro video added successfully!");
//       // setVideoUrl(""); 
//     } catch (error) {
//       console.error(error);
//       toast.error(error.response?.data?.message || "Error adding intro video");
//     }
//   };

//   return (
//     <>
//       <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 mt-8 max-w-3xl mx-auto">
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <p className="text-2xl font-bold text-gray-800 mb-3"> Add Course Intro Video </p>
//           <input
//             type="url"
//             value={videoUrl}
//             onChange={(e) => setVideoUrl(e.target.value)}
//             placeholder="Paste video URL here"
//             className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
//             required
//           />
//           <p className="text-xs text-gray-500 "> Paste any public video URL. </p>

//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
//           >
//             Upload Video
//           </button>
//         </form>
//       </div>

//       <ToastContainer position="top-right" autoClose={2000} />
//     </>
//   );
// };

// export default CourseIntroVideo;

import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Helper function to make any video URL playable
const normalizeVideoUrl = (url) => {
  if (!url) return "";
  if (url.includes("youtube.com/watch?v=")) {
    const id = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  if (url.includes("drive.google.com/file/d/")) {
    const id = url.match(/\/d\/(.*?)\//)?.[1];
    return id ? `https://drive.google.com/uc?export=preview&id=${id}` : url;
  }
  if (url.includes("dropbox.com")) {
    return url.replace("?dl=0", "?raw=1");
  }
  if (url.includes("vimeo.com/")) {
    const id = url.split("vimeo.com/")[1]?.split("?")[0];
    return `https://player.vimeo.com/video/${id}`;
  }
  if (url.includes("docs.google.com/videos")) {
  return toast.error("Google Docs video links cannot be embedded. Please upload or share a Google Drive video file instead.");
}

  return url;
};

const CourseIntroVideo = ({ courseId }) => {
  const [videoUrl, setVideoUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoUrl) return toast.error("Please enter a video URL");

    const playableUrl = normalizeVideoUrl(videoUrl);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/course-intro-video/create`,
        {
          courseId,
          videoUrl: playableUrl,
          title: "Intro Video",
        }
      );

      toast.success(res.data.message || "Intro video added successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error adding intro video");
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 mt-8 max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-2xl font-bold text-gray-800 mb-3">
            Add Course Intro Video
          </p>

          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Paste video URL (YouTube, Drive, Dropbox...)"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            required
          />

          <p className="text-xs text-gray-500">
            Paste any public video link (YouTube, Google Drive, Vimeo, Dropbox)
          </p>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Upload Video
          </button>
        </form>

        {videoUrl && (
          <div className="mt-6 aspect-video">
            <iframe
              src={normalizeVideoUrl(videoUrl)}
              className="w-full h-full rounded-lg shadow"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Video Preview"
            ></iframe>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={2000}  />
    </>
  );
};

export default CourseIntroVideo;
