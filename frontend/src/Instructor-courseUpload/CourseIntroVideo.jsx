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

//-----------------------------------------------------------------------------------------

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
  // if (url.includes("drive.google.com/file/d/")) {
  //   const id = url.match(/\/d\/(.*?)\//)?.[1];
  //   return id ? `https://drive.google.com/uc?export=preview&id=${id}` : url;
  // }
  if (url.includes("dropbox.com")) {
    return url.replace(/\?dl=0/, "?raw=1").replace(/&dl=0/, "&raw=1").replace(/\?dl=1/, "?raw=1").replace(/&dl=1/, "&raw=1");
  }
  
  if (url.includes("vimeo.com/")) {
    const id = url.split("vimeo.com/")[1]?.split("?")[0];
    return `https://player.vimeo.com/video/${id}`;
  }

 if (url.includes("drive.google.com")) {
    // Check if it's a folder link
    if (url.includes("/folders/")) {
      return null; // Signal that this is invalid
    }

    // Check if it's a Docs video link (not supported)
    if (url.includes("docs.google.com/videos")) {
      return null; // Signal that this is invalid
    }

    // Extract file ID from various Drive URL formats
    let fileId = null;
    
    // Format: /file/d/FILE_ID/view
    const fileMatch = url.match(/\/file\/d\/([^\/\?]+)/);
    if (fileMatch) {
      fileId = fileMatch[1];
    }
    
    // Format: ?id=FILE_ID
    if (!fileId) {
      const idMatch = url.match(/[?&]id=([^&]+)/);
      if (idMatch) {
        fileId = idMatch[1];
      }
    }

    // Return proper embed URL
    if (fileId) {
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
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

//----------------------------------------------------------------------------------------------------------
// import axios from "axios";
// import React, { useState } from "react";

// // Helper function to make any video URL playable
// const normalizeVideoUrl = (url) => {
//   if (!url) return "";

//   // YouTube handling
//   if (url.includes("youtube.com/watch?v=")) {
//     const id = url.split("v=")[1]?.split("&")[0];
//     return `https://www.youtube.com/embed/${id}`;
//   }
//   if (url.includes("youtu.be/")) {
//     const id = url.split("youtu.be/")[1]?.split("?")[0];
//     return `https://www.youtube.com/embed/${id}`;
//   }

//   // Vimeo handling
//   if (url.includes("vimeo.com/")) {
//     const id = url.split("vimeo.com/")[1]?.split("?")[0]?.split("/")[0];
//     return `https://player.vimeo.com/video/${id}`;
//   }

//   // Dropbox handling
//   if (url.includes("dropbox.com")) {
//     return url
//       .replace(/\?dl=0/, "?raw=1")
//       .replace(/&dl=0/, "&raw=1")
//       .replace(/\?dl=1/, "?raw=1")
//       .replace(/&dl=1/, "&raw=1");
//   }

//   // Google Drive handling
//   if (url.includes("drive.google.com")) {
//     // Check if it's a folder link
//     if (url.includes("/folders/")) {
//       return null; // Signal that this is invalid
//     }

//     // Check if it's a Docs video link (not supported)
//     if (url.includes("docs.google.com/videos")) {
//       return null; // Signal that this is invalid
//     }

//     // Extract file ID from various Drive URL formats
//     let fileId = null;
    
//     // Format: /file/d/FILE_ID/view
//     const fileMatch = url.match(/\/file\/d\/([^\/\?]+)/);
//     if (fileMatch) {
//       fileId = fileMatch[1];
//     }
    
//     // Format: ?id=FILE_ID
//     if (!fileId) {
//       const idMatch = url.match(/[?&]id=([^&]+)/);
//       if (idMatch) {
//         fileId = idMatch[1];
//       }
//     }

//     // Return proper embed URL
//     if (fileId) {
//       return `https://drive.google.com/file/d/${fileId}/preview`;
//     }
//   }

//   // Return original URL if no special handling needed
//   return url;
// };

// const CourseIntroVideo = ({ courseId = "demo-course" }) => {
//   const [videoUrl, setVideoUrl] = useState("");
//   const [message, setMessage] = useState({ type: "", text: "" });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const showMessage = (type, text) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage({ type: "", text: "" }), 3000);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!videoUrl) {
//       showMessage("error", "Please enter a video URL");
//       return;
//     }

//     const playableUrl = normalizeVideoUrl(videoUrl);

//     // Check for invalid Drive links
//     if (playableUrl === null) {
//       if (videoUrl.includes("/folders/")) {
//         showMessage("error", "Google Drive folder links cannot be embedded. Please share a direct video file link instead.");
//         return;
//       }
//       if (videoUrl.includes("docs.google.com/videos")) {
//         showMessage("error", "Google Docs video links cannot be embedded. Please upload to Drive and share the file link.");
//         return;
//       }
//       showMessage("error", "Invalid Google Drive link. Please use a direct file link.");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       // Replace this with your actual API endpoint
//       const backendUrl = typeof window !== 'undefined' && window.VITE_BACKEND_URL 
//         ? window.VITE_BACKEND_URL 
//         : 'http://localhost:5000'; // fallback for demo
      
//       const response = await axios.post(
//          `${import.meta.env.VITE_BACKEND_URL}/api/course-intro-video/create`,
//          {
//            courseId,
//            videoUrl: playableUrl,
//            title: "Intro Video",
//          }
//        );

//       const data = await response.json();

//       if (response.ok) {
//         showMessage("success", data.message || "Intro video added successfully!");
//       } else {
//         showMessage("error", data.message || "Error adding intro video");
//       }
//     } catch (error) {
//       console.error(error);
//       showMessage("error", "Error adding intro video. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       {/* Toast Message */}
//       {message.text && (
//         <div className="fixed top-4 right-4 z-50 animate-slide-in">
//           <div
//             className={`px-6 py-3 rounded-lg shadow-lg ${
//               message.type === "success"
//                 ? "bg-green-500 text-white"
//                 : "bg-red-500 text-white"
//             }`}
//           >
//             {message.text}
//           </div>
//         </div>
//       )}

//       <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 mt-8 max-w-3xl mx-auto">
//         <div className="space-y-4">
//           <p className="text-2xl font-bold text-gray-800 mb-3">
//             Add Course Intro Video
//           </p>

//           <input
//             type="url"
//             value={videoUrl}
//             onChange={(e) => setVideoUrl(e.target.value)}
//             placeholder="Paste video URL (YouTube, Drive, Dropbox, Vimeo...)"
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
//             required
//           />

//           <div className="text-xs text-gray-600 space-y-1">
//             <p className="font-medium">Supported formats:</p>
//             <ul className="list-disc list-inside pl-2 space-y-0.5">
//               <li>YouTube: youtube.com or youtu.be links</li>
//               <li>Google Drive: Direct file links (not folders)</li>
//               <li>Vimeo: vimeo.com links</li>
//               <li>Dropbox: dropbox.com shared links</li>
//               <li>Cloudinary: Direct video URLs</li>
//             </ul>
//           </div>

//           <button
//             onClick={handleSubmit}
//             disabled={isSubmitting}
//             className={`px-6 py-2 rounded-md transition duration-200 ${
//               isSubmitting
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700"
//             } text-white`}
//           >
//             {isSubmitting ? "Uploading..." : "Upload Video"}
//           </button>
//         </div>

//         {videoUrl && normalizeVideoUrl(videoUrl) && (
//           <div className="mt-6">
//             <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
//             <div className="aspect-video">
//               <iframe
//                 src={normalizeVideoUrl(videoUrl)}
//                 className="w-full h-full rounded-lg shadow border border-gray-200"
//                 allow="autoplay; encrypted-media"
//                 allowFullScreen
//                 title="Video Preview"
//               ></iframe>
//             </div>
//           </div>
//         )}
//       </div>

//       <style>{`
//         @keyframes slide-in {
//           from {
//             transform: translateX(100%);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }
//         .animate-slide-in {
//           animation: slide-in 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default CourseIntroVideo;