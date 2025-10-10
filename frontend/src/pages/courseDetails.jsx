// import React, { useEffect, useState } from "react";
// import {
//   useLocation,
//   Link,
//   useParams,
//   Navigate,
//   useNavigate,
// } from "react-router-dom";
// import { FaStar, FaRegStar } from "react-icons/fa";
// import { FaRegStarHalfStroke } from "react-icons/fa6";
// import { FaTwitter, FaDribbble, FaLinkedin } from "react-icons/fa";
// import { MdCurrencyRupee, MdLockOutline } from "react-icons/md";
// import { toast, ToastContainer } from "react-toastify";
// import axios from "axios";

// import Card from "../componant/Card";
// import avatar from "../assets/image/avatar.png";
// import all_course from "../assets/Course_Data";
// import ReactPlayer from "react-player";
// import LessonVideoPlayer from "../Instructor-courseUpload/LassonVideoPlayer";
// import { useStudentAuth } from "../studentDashboard/StudentesPages/studentAuth";

// const CourseDetails = () => {
//   const { id } = useParams(); // getting from URL
//   const location = useLocation();
//   const course = location.state;
//   const { fetchCartItems } = useStudentAuth();
//   const [showVideo, setShowVideo] = useState({});
//   const [activeVideoUrl, setActiveVideoUrl] = useState(null);
//   const navigate = useNavigate();

//   //  assignment and submit
//   const [selectedAssignment, setSelectedAssignment] = useState(null);
//   const [statusLoading, setStatusLoading] = useState(false);
//   const [subStatus, setSubStatus] = useState(null);
//   const [file, setFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [msg, setMsg] = useState("");

//   useEffect(() => {
//     const fetchStatus = async () => {
//       if (!selectedAssignment?._id) return;
//       setStatusLoading(true);
//       setMsg("");

//       try {
//         const res = await axios.get(
//           `${import.meta.env.VITE_BACKEND_URL}/api/assignments/${
//             selectedAssignment._id
//           }/my-status`,
//           {
//             withCredentials: true, // ✅ include cookies
//           }
//         );

//         if (!res.data.success)
//           throw new Error(res.data.message || "Failed to load status");

//         setSubStatus(res.data);
//       } catch (err) {
//         setMsg(
//           err.response?.data?.message ||
//             err.message ||
//             "Could not fetch submission status"
//         );
//         setSubStatus(null);
//       } finally {
//         setStatusLoading(false);
//       }
//     };

//     fetchStatus();
//   }, [selectedAssignment]);

//   // 🧠 Validate PDF file
//   const onFileChange = (e) => {
//     setMsg("");
//     const f = e.target.files?.[0];
//     if (!f) return setFile(null);

//     if (f.type !== "application/pdf") {
//       setMsg("Only PDF files are allowed.");
//       e.target.value = "";
//       return setFile(null);
//     }
//     if (f.size > 10 * 1024 * 1024) {
//       setMsg("File too large. Max 10MB.");
//       e.target.value = "";
//       return setFile(null);
//     }
//     setFile(f);
//   };

//   // 🧠 Submit assignment PDF
//   const onSubmit = async () => {
//     if (!selectedAssignment?._id) return;
//     if (!file) {
//       setMsg("Please choose a PDF file first.");
//       return;
//     }

//     setUploading(true);
//     setMsg("");

//     try {
//       const form = new FormData();
//       form.append("pdf", file);

//       const res = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/assignments/${
//           selectedAssignment._id
//         }/submit`,
//         form,
//         {
//           withCredentials: true, // ✅ include cookies
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (!res.data.success)
//         throw new Error(res.data.message || "Submission failed");

//       setMsg("✅ Assignment submitted successfully.");
//       setFile(null);

//       setSubStatus((prev) => ({
//         ...(prev || {}),
//         status: "completed",
//         pdfUrl: res.data.submission?.pdfUrl || prev?.pdfUrl,
//         submittedAt:
//           res.data.submission?.submittedAt || new Date().toISOString(),
//       }));
//     } catch (err) {
//       setMsg(
//         err.response?.data?.message ||
//           err.message ||
//           "Submission failed. Try again."
//       );
//     } finally {
//       setUploading(false);
//     }
//   };

//   const addToCart = async (course) => {
//     try {
//       await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/cart/add`,
//         { courseId: course._id },
//         { withCredentials: true }
//       );
//       toast.success("Added to cart");
//       fetchCartItems();
//       navigate("/cart");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to add to cart");
//     }
//   };

//   useEffect(() => {
//     if (course?.introVideo?.videoUrl) {
//       setActiveVideoUrl(course.introVideo.videoUrl);
//     }
//   }, [course]);

//   if (!course) {
//     return <p className="text-center text-gray-500 mt-6">Loading course...</p>;
//   }

//   const [activeTab, setActiveTab] = useState("Overview");

//   const [reviews, setReviews] = useState([]);

//   // it is from api but i am fetching review from course
//   const fetchReviews = async () => {
//     if (!course?._id) return;
//     try {
//       const { data } = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URL}/api/reviews/${course._id}`
//       );
//       setReviews(data);
//     } catch (err) {
//       console.error("Error fetching reviews:", err);
//     }
//   };

//   useEffect(() => {
//     fetchReviews();
//   }, [course]);

//   const averageRating =
//     reviews?.length > 0
//       ? (
//           reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
//         ).toFixed(1)
//       : 0;

//       // for status paid ----------------------------------
//   const [paid, setPaid] = useState(false);

//    useEffect(() => {
//      (async () => {
//        try {
//          const { data } = await axios.get(
//            `${import.meta.env.VITE_BACKEND_URL}/api/payment/is-paid/${course._id}`,
//            { withCredentials: true }
//          );
//          setPaid(data.paid);
//        } catch (err) {
//          console.log("Not logged in or error checking purchase");
//        }
//      })();
//    }, [course._id]);

//   const content = {
//     Overview: (
//       <div className="px-6 md:px-12 my-6">
//         <h1 className="text-xl font-bold mb-4">Description</h1>
//         <p className="text-gray-600 mb-6">
//           {course?.overview?.overviewDescription || course?.description}
//         </p>
//         <div className="flex flex-col gap-4">
//           {course?.overview?.whatYouWillLearn ? (
//             <p>
//               <strong>What you'll learn:</strong>{" "}
//               {course.overview.whatYouWillLearn}
//             </p>
//           ) : (
//             "No Info Available"
//           )}
//         </div>
//       </div>
//     ),
//     Curriculum: (

//       <>
//       <div>
//       {paid ?

//       <div className="px-6 md:px-12 my-6">
//         <h2 className="text-lg font-bold mb-4">Course Modules</h2>

//         <p className="text-md font-medium mt-2 text-gray-400">
//           Total Lessons:{" "}
//           {course.modules?.reduce(
//             (sum, module) => sum + (module.lessons?.length || 0),
//             0
//           ) || 0}
//         </p>

//         {course.modules?.length > 0 ? (
//           course.modules.map((module, midx) => (
//             <div
//               key={module._id}
//               className="mb-6 border border-gray-200 p-4 rounded"
//             >
//               <h2 className=" font-bold text-md mb-3">
//                 Module {midx + 1}: {module.title}
//               </h2>

//               <ul>
//                 {module.lessons?.length > 0 ? (
//                   module.lessons.map((lesson, lidx) => {
//                     const formattedTime = `${lesson.lessonHour || 0}h ${
//                       lesson.lessonMinute || 0
//                     }m ${lesson.lessonSecond || 0}s`;

//                     return (
//                       <li
//                         key={lesson._id}
//                         className="bg-white rounded-lg shadow-sm p-4 my-4"
//                       >
//                         {/* Title */}
//                         <div className="flex justify-between items-center">
//                           <div className="font-semibold text-gray-800">
//                             {lidx + 1}. {lesson.lessonTitle}
//                             <span className="text-sm text-gray-500 ml-2">
//                               ({formattedTime})
//                             </span>
//                           </div>
//                         </div>

//                         {/* Content */}
//                         <p className="text-gray-600 mt-2">
//                           {lesson.lessonContent}
//                         </p>

//                         {/* Video Toggle */}
//                         <button
//                           onClick={() => {
//                             setShowVideo((prev) => ({
//                               ...prev,
//                               [lesson._id]: !prev[lesson._id],
//                             }));

//                             if (showVideo?.[lesson._id]) {
//                               setActiveVideoUrl(
//                                 course?.introVideo?.videoUrl || null
//                               );
//                             } else {
//                               setActiveVideoUrl(lesson.lessonVideoSource);
//                             }
//                           }}
//                           className="mt-3 text-white bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded-md text-sm"
//                         >
//                           {showVideo?.[lesson._id]
//                             ? "Hide Video"
//                             : "Watch Course Video"}
//                         </button>
//                       </li>
//                     );
//                   })
//                 ) : (
//                   <li className="text-gray-400 italic">
//                     No lessons in this module.
//                   </li>
//                 )}
//               </ul>

//               <div className="mt-4">
//                 <h4 className="text-sm font-medium text-gray-700">
//                   Assignments:
//                 </h4>
//                 <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
//                   {module.assignments?.length > 0 ? (
//                     module.assignments.map((assignment) => (
//                       <li
//                         key={assignment._id}
//                         className="flex justify-between cursor-pointer hover:underline hover:text-blue-500"
//                         onClick={() => setSelectedAssignment(assignment)}
//                       >
//                         {assignment.title} <span>full-details</span>
//                       </li>
//                     ))
//                   ) : (
//                     <li className="text-gray-400 italic">
//                       No assignments in this module.
//                     </li>
//                   )}
//                 </ul>

//                 {/* 🔹 Modal */}
//                 {selectedAssignment && (
//                   <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
//                     <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
//                       {/* Close */}
//                       <button
//                         onClick={() => {
//                           setSelectedAssignment(null);
//                           setSubStatus(null);
//                           setFile(null);
//                           setMsg("");
//                         }}
//                         className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl"
//                       >
//                         ✖
//                       </button>

//                       {/* Assignment Info */}
//                       <h2 className="text-xl font-bold mb-2">
//                         {selectedAssignment.title}
//                       </h2>
//                       <p className="text-gray-700 mb-4">
//                         {selectedAssignment.summary}
//                       </p>

//                       <h3 className="font-semibold mb-2">Questions:</h3>
//                       <ul className="list-decimal pl-5 space-y-2 text-gray-600">
//                         {selectedAssignment.questions?.map((q, index) => (
//                           <li key={index}>{q.questionText || q}</li>
//                         ))}
//                       </ul>

//                       <div className="border-t my-4" />

//                       {/* 🔹 Status */}
//                       <div className="mb-3">
//                         <h4 className="font-semibold">Your submission</h4>
//                         {statusLoading ? (
//                           <p className="text-sm text-gray-500 mt-1">
//                             Loading status…
//                           </p>
//                         ) : subStatus ? (
//                           <div className="text-sm mt-1 space-y-1">
//                             <p>
//                               Status:{" "}
//                               <span
//                                 className={
//                                   subStatus.status === "completed"
//                                     ? "text-green-600 font-medium"
//                                     : "text-yellow-700 font-medium"
//                                 }
//                               >
//                                 {subStatus.status || "pending"}
//                               </span>
//                             </p>
//                             {subStatus.submittedAt && (
//                               <p className="text-gray-600">
//                                 Submitted:{" "}
//                                 {new Date(
//                                   subStatus.submittedAt
//                                 ).toLocaleString()}
//                               </p>
//                             )}
//                             {subStatus.pdfUrl && (
//                               <div className="flex flex-col sm:flex-row gap-2">
//                                 <p className="font-medium text-slate-700">
//                                   PDF:
//                                 </p>
//                                 <div className="flex gap-3">
//                                   {/* View PDF */}
//                                   <a
//                                     href={subStatus.pdfUrl}
//                                     target="_blank"
//                                     rel="noreferrer"
//                                     className="text-blue-600 underline"
//                                   >
//                                     View
//                                   </a>

//                                   {/* Download PDF */}
//                                   <a
//                                     href={subStatus.pdfUrl}
//                                     download
//                                     className="text-green-600 underline"
//                                   >
//                                     Download
//                                   </a>
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         ) : (
//                           <p className="text-sm text-gray-500 mt-1">
//                             No submission yet (pending).
//                           </p>
//                         )}
//                       </div>

//                       {/* 🔹 Upload Form */}
//                       <div className="space-y-2">
//                         <label className="block text-sm font-medium">
//                           Upload PDF
//                         </label>
//                         <input
//                           type="file"
//                           accept="application/pdf"
//                           onChange={onFileChange}
//                           className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                         />
//                         {file && (
//                           <p className="text-xs text-gray-500">
//                             Selected: {file.name} (
//                             {(file.size / (1024 * 1024)).toFixed(2)} MB)
//                           </p>
//                         )}

//                         {msg && (
//                           <p
//                             className={`text-sm ${
//                               msg.startsWith("✅")
//                                 ? "text-green-600"
//                                 : "text-red-600"
//                             }`}
//                           >
//                             {msg}
//                           </p>
//                         )}

//                         <div className="flex items-center gap-2 pt-2">
//                           <button
//                             disabled={uploading || !file}
//                             onClick={onSubmit}
//                             className={`px-4 py-2 rounded-md text-white ${
//                               uploading || !file
//                                 ? "bg-blue-300 cursor-not-allowed"
//                                 : "bg-blue-600 hover:bg-blue-700"
//                             }`}
//                           >
//                             {uploading
//                               ? "Submitting…"
//                               : subStatus?.status === "completed"
//                               ? "Re-submit PDF"
//                               : "Submit PDF"}
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500">No modules found for this course.</p>
//         )}
//       </div>   :

//        <div className="flex items-center justify-center">
//       <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl p-6 text-center shadow-md">
//         <div className="flex items-center justify-center mb-3">
//           <MdLockOutline className="text-slate-700 w-7 h-7" />
//         </div>
//         <p className="text-slate-800 font-semibold">To unlock module pay first</p>
//         <p className="text-slate-500 text-sm mt-1">Complete your purchase to access all lessons & assignments.</p>

//         <button
//           className="mt-4 px-4 py-2 rounded-md bg-[#296AD2] text-white text-sm font-medium hover:bg-blue-700"
//            onClick={() => addToCart(course)}
//         >
//           Add to cart
//         </button>
//       </div>
//     </div>
//       }

//       </div>
//       </>
//     ),
//     Instructor: (
//       <div className="px-6 md:px-12 my-6">
//         <div className="flex p-4 gap-4 items-center">
//           {/* Avatar or Fallback */}
//           {course.instructor?.avatar ? (
//             <img
//               src={course.instructor.avatar}
//               alt="Instructor"
//               className="w-40 h-40 object-cover rounded-full shadow-md border"
//             />
//           ) : (
//             <div className="w-24 h-24 rounded-full bg-blue-500 text-white flex items-center justify-center text-5xl font-bold shadow-md">
//               {course.instructor?.name?.[0]?.toUpperCase() || "U"}
//             </div>
//           )}

//           {/* Instructor Info */}
//           <div className="flex flex-col gap-3">
//             <h1 className="text-xl font-semibold">
//               <span className="font-bold text-gray-700">Instructor :</span>{" "}
//               {course.instructor?.name || "Unknown Instructor"}
//             </h1>

//             <p className="font-semibold">
//               <span className="font-bold text-gray-700">Occupation :</span>{" "}
//               {course.instructor?.profile?.skill || "No skills listed"}
//             </p>

//             <p className="text-gray-600">
//               <span className="font-bold text-gray-700">Bio :</span>{" "}
//               {course.instructor?.profile?.bio || "No bio available"}
//             </p>
//           </div>
//         </div>
//       </div>
//     ),
//     Review: (
//       <div className="px-6 md:px-12 my-6">
//         {course.reviews.length === 0 && (
//           <p className="text-gray-500 italic">
//             No reviews yet. Be the first to review this course!
//           </p>
//         )}

//         {course.reviews.map((review, index) => (
//           <div
//             key={index}
//             className="flex items-start gap-4 pb-4 mb-4  border-gray-200"
//           >
//             {/* Avatar */}
//             <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
//               {review.userId?.name?.[0]?.toUpperCase() || "U"}
//             </div>

//             {/* Review Content */}
//             <div className="flex-1 ">
//               {/* Name + Date */}
//               <div className="flex  gap-2 items-center ">
//                 <h1 className="text-sm font-semibold">
//                   {review.userId?.name
//                     ? review.userId.name.charAt(0).toUpperCase() +
//                       review.userId.name.slice(1).toLowerCase()
//                     : "Unknown"}
//                 </h1>
//                 <p className="text-xs text-gray-500">
//                   {new Date(review.createdAt).toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "short",
//                     day: "numeric",
//                   })}
//                 </p>
//               </div>

//               {/* Comment */}
//               <p className=" text-gray-700 leading-relaxed text-sm">
//                 {review.comment}
//               </p>

//               {/* Rating */}
//               <div className="flex gap-1  text-yellow-400 text-sm">
//                 {Array.from({ length: 5 }, (_, i) => {
//                   if (i < Math.floor(review.rating)) return <FaStar key={i} />;
//                   if (i < review.rating) return <FaRegStarHalfStroke key={i} />;
//                   return <FaRegStar key={i} />;
//                 })}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     ),
//     Announcement: (
//       <>
//         {course.announcement?.length > 0 ? (
//           <div className="mt-2">
//             <h4 className="font-medium text-gray-700"> Announcements:</h4>
//             <ul className="list-disc list-inside text-sm text-gray-600">
//               {[...course.announcement].reverse().map((ann) => (
//                 <li key={ann._id}>
//                   {ann.title}{" "}
//                   <span className="text-xs text-gray-400">
//                     ({new Date(ann.createdAt).toLocaleDateString()})
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ) : (
//           <p className="text-gray-500 text-sm">No announcements yet.</p>
//         )}
//       </>
//     ),
//   };

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [location.pathname]);

//   return (
//     <>
//       <div className="p-3">
//         <img
//           src={`${import.meta.env.VITE_BACKEND_URL}${course.thumbnail}`}
//           alt="Course Banner"
//           className="h-[50vh] md:h-[70vh] w-full object-contain object-center rounded"
//         />
//       </div>

//       <div className="relative">
//         <div className="shadow-lg bg-white px-6 py-4 max-w-3xl md:mx-6 mx-auto rounded-xl  md:-mt-10">
//           <h1 className="text-2xl font-bold mb-3">{course.title}</h1>
//           <div className="flex flex-wrap md:flex-nowrap gap-6">
//             <div className="flex-1">
//               <h3 className="text-gray-500">Instructor</h3>
//               <p className="font-semibold">{course.instructor.name}</p>
//             </div>
//             <div className="flex-1">
//               <h3 className="text-gray-500">Category</h3>
//               <p className="font-semibold"> {course.categories}</p>
//             </div>
//             <div className="flex-1">
//               <h3 className="text-gray-500">Review</h3>
//               <div className="flex items-center gap-1 text-amber-300">
//                 {Array.from({ length: 5 }).map((_, i) => (
//                   <span key={i}>
//                     {i < Math.round(averageRating) ? "⭐" : ""}
//                   </span>
//                 ))}
//                 ({averageRating})
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-col md:flex-row gap-8 px-6 md:px-12 my-12">
//         <div className="flex-1">
//           <div className="flex gap-4 border-b mb-6 overflow-x-auto">
//             {[
//               "Overview",
//               "Curriculum",
//               "Instructor",
//               "Review",
//               "Announcement",
//             ].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`pb-2 md:px-4 px-3 font-medium ${
//                   activeTab === tab
//                     ? "border-b-2 border-blue-500 text-blue-500"
//                     : "border-transparent text-gray-600 hover:text-blue-500"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>
//           <div>{content[activeTab]}</div>
//         </div>

//         <aside className="w-full md:w-[400px] flex-shrink-0  p-4 rounded-xl bg-white lg:-mt-43 -mt-10 ">
//           {/* <img src={video} alt="Demo Video" className="rounded-md mb-6" /> */}
//           {activeVideoUrl && ReactPlayer.canPlay(activeVideoUrl) ? (
//             <div>
//               <h3 className="text-lg font-semibold mb-2">📽️ Now Playing</h3>
//               <ReactPlayer
//                 url={activeVideoUrl}
//                 controls
//                 width="100%"
//                 height="360px"
//               />
//             </div>
//           ) : (
//             <p className="text-red-500">⚠️ No video available</p>
//           )}

//           <div className="flex items-center ">
//             <MdCurrencyRupee className="h-6 w-6" />
//             <h2 className="text-2xl font-bold">{course.discountPrice}</h2>
//           </div>

//           <button
//             onClick={() => addToCart(course)}
//             className="cursor-pointer w-full bg-blue-700 text-white py-3 rounded-lg mb-6 hover:bg-blue-800"
//           >
//             Add To Cart
//           </button>

//           <p className="text-xl font-semibold mb-2"> This Course Includes </p>
//           <div className="flex flex-col gap-2 text-gray-600">
//             <p>✅ {course?.overview?.videoHours || 5}hrs on-demand video</p>
//             <p>
//               ✅ Instructor:{" "}
//               {course?.overview?.overviewInstructor || course.instructor.name}
//             </p>
//             <p>
//               ✅ Language:{" "}
//               {course?.overview?.overviewLanguage || "Hindi,English"}
//             </p>
//             <p>✅ Level:{course?.overview?.courseLevel || "Beginner"}</p>
//             <p>
//               {course?.overview?.certificate ? "✅ " : "❌ "}
//               Certificate
//             </p>
//             <p>
//               {course?.overview?.accessOnMobileAndTV ? "✅ " : "❌ "}
//               Access on Mobile & TV
//             </p>
//           </div>
//           <div className="flex items-center gap-3 mt-6">
//             <h3 className="font-bold">Share:</h3>
//             <a href="#" className="p-2 bg-gray-300 rounded-full">
//               <FaDribbble />
//             </a>
//             <a href="#" className="p-2 bg-gray-300 rounded-full">
//               <FaLinkedin />
//             </a>
//             <a href="#" className="p-2 bg-gray-300 rounded-full">
//               <FaTwitter />
//             </a>
//           </div>
//         </aside>
//       </div>

//       <div className="px-6 md:px-12 my-20 text-center">
//         <h2 className="text-blue-500 text-sm">Explore Recommended Courses</h2>
//         <h1 className="text-3xl md:text-4xl font-bold mb-4">
//           You Might Also Like
//         </h1>
//         <p className="text-gray-600 mb-12">
//           Discover personalized course recommendations curated to match your
//           interests and learning goals.
//         </p>

//         <Card all_course={all_course.slice(0, 3)} />
//       </div>
//       <ToastContainer position="top-right" autoClose={1000} />
//     </>
//   );
// };

// export default CourseDetails;

import React, { useEffect, useState } from "react";
import {
  useLocation,
  Link,
  useParams,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import { FaTwitter, FaDribbble, FaLinkedin } from "react-icons/fa";
import { MdCurrencyRupee, MdLockOutline } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

import Card from "../componant/Card";
import avatar from "../assets/image/avatar.png";
import all_course from "../assets/Course_Data";
import ReactPlayer from "react-player";
// removed import of external LassonVideoPlayer since it's merged below
import { useStudentAuth } from "../studentDashboard/StudentesPages/studentAuth";
import { FiLock } from "react-icons/fi";
import QuizModal from "./QuizModel";

const CourseDetails = () => {
  const { id } = useParams(); // getting from URL
  const location = useLocation();
  const course = location.state;
  const { fetchCartItems } = useStudentAuth();
  const navigate = useNavigate();

  // track which lesson is open (only one at a time)
  const [openLessonId, setOpenLessonId] = useState(null);

  // The main hero player URL (intro by default; switches to lesson URL when opened)
  const [mainVideoUrl, setMainVideoUrl] = useState(
    course?.introVideo?.videoUrl || null
  );

  //  assignment and submit
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [subStatus, setSubStatus] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // put this inside your CourseDetails component (replace your old openModal)
const openModal = async (quizOrId) => {
  const base = import.meta.env.VITE_BACKEND_URL || "";

  // helper: shallow search for a "questions" array anywhere in an object
  function findQuestions(obj) {
    if (!obj || typeof obj !== "object") return null;
    if (Array.isArray(obj.questions)) return obj;
    // search top-level keys
    for (const k of Object.keys(obj)) {
      const v = obj[k];
      if (Array.isArray(v) && k.toLowerCase().includes("question")) {
        // e.g. data.questions or data.quizQuestions
        return { questions: v, ...obj };
      }
      if (v && typeof v === "object") {
        // nested object (one level deep)
        if (Array.isArray(v.questions)) return v;
      }
    }
    return null;
  }

  try {
    // if a fully-populated quiz object passed (has questions array), use it directly
    if (quizOrId && typeof quizOrId === "object" && Array.isArray(quizOrId.questions)) {
      console.log("openModal: using passed-in populated quiz object", quizOrId);
      setSelectedQuiz(quizOrId);
      setAnswers(new Array(quizOrId.questions.length).fill(null));
      setResult(null);
      setShowModal(true);
      return;
    }

    // extract id if an object was passed
    const quizId = typeof quizOrId === "string" ? quizOrId : quizOrId?._id;
    if (!quizId) {
      toast.error("Invalid quiz id");
      return;
    }

    // try two common endpoints (tolerant)
    const endpoints = [`${base}/api/quiz/${quizId}`, `${base}/api/quizzes/${quizId}`];

    let resp = null;
    let data = null;
    for (const url of endpoints) {
      try {
        console.log("openModal: fetching quiz from", url);
        resp = await axios.get(url, { withCredentials: true });
        data = resp.data;
        console.log("openModal: raw response for", url, resp);
        // if we got something, break and inspect
        if (data) break;
      } catch (err) {
        console.warn("openModal: fetch failed for", url, err?.response?.status || err.message);
        // continue to try next endpoint
      }
    }

    if (!data) {
      throw new Error("No response from quiz endpoints");
    }

    // possible shapes:
    // 1) { success: true, quiz: { ... } }
    // 2) { quiz: { ... } }
    // 3) { ...quizFields... } (quiz object directly)
    // 4) { data: { quiz: {...} } } etc.

    // try to extract the quiz object
    let quizCandidate = data.quiz || data.data?.quiz || data.data || data;

    // If quizCandidate still has wrapper keys (e.g. { success:true, quiz: {...} }), search deeper
    if (!Array.isArray(quizCandidate?.questions)) {
      const maybe = findQuestions(data) || findQuestions(data.quiz) || findQuestions(data.data) || findQuestions(quizCandidate);
      if (maybe) {
        // maybe is object that contains questions
        quizCandidate = maybe;
      }
    }

    // final check
    if (!quizCandidate || !Array.isArray(quizCandidate.questions)) {
      console.error("openModal: could not find questions in the server response. Full response:", data);
      toast.error("Quiz data missing questions — check server response (see console).");
      return;
    }

    // success — set state
    setSelectedQuiz(quizCandidate);
    setAnswers(new Array(quizCandidate.questions.length).fill(null));
    setResult(null);
    setShowModal(true);
  } catch (err) {
    console.error("openModal error:", err);
    toast.error(err.response?.data?.message || err.message || "Failed to load quiz");
  }
};


  // handleSubmit: validate all answered then post
  const handleSubmit = async () => {
    if (!selectedQuiz) return;
    if (
      answers.length !== (selectedQuiz.questions?.length || 0) ||
      answers.some((a) => a === null || a === undefined)
    ) {
      toast.error("Please answer all questions before submitting.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/quiz/submit`,
        { quizId: selectedQuiz._id, answers },
        { withCredentials: true }
      );
      setResult(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit quiz");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchStatus = async () => {
      if (!selectedAssignment?._id) return;
      setStatusLoading(true);
      setMsg("");

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/assignments/${
            selectedAssignment._id
          }/my-status`,
          {
            withCredentials: true, // ✅ include cookies
          }
        );

        if (!res.data.success)
          throw new Error(res.data.message || "Failed to load status");

        setSubStatus(res.data);
      } catch (err) {
        setMsg(
          err.response?.data?.message ||
            err.message ||
            "Could not fetch submission status"
        );
        setSubStatus(null);
      } finally {
        setStatusLoading(false);
      }
    };

    fetchStatus();
  }, [selectedAssignment]);

  // 🧠 Validate PDF file
  const onFileChange = (e) => {
    setMsg("");
    const f = e.target.files?.[0];
    if (!f) return setFile(null);

    if (f.type !== "application/pdf") {
      setMsg("Only PDF files are allowed.");
      e.target.value = "";
      return setFile(null);
    }
    if (f.size > 10 * 1024 * 1024) {
      setMsg("File too large. Max 10MB.");
      e.target.value = "";
      return setFile(null);
    }
    setFile(f);
  };

  // 🧠 Submit assignment PDF
  const onSubmit = async () => {
    if (!selectedAssignment?._id) return;
    if (!file) {
      setMsg("Please choose a PDF file first.");
      return;
    }

    setUploading(true);
    setMsg("");

    try {
      const form = new FormData();
      form.append("pdf", file);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/assignments/${
          selectedAssignment._id
        }/submit`,
        form,
        {
          withCredentials: true, // ✅ include cookies
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!res.data.success)
        throw new Error(res.data.message || "Submission failed");

      setMsg("✅ Assignment submitted successfully.");
      setFile(null);

      setSubStatus((prev) => ({
        ...(prev || {}),
        status: "completed",
        pdfUrl: res.data.submission?.pdfUrl || prev?.pdfUrl,
        submittedAt:
          res.data.submission?.submittedAt || new Date().toISOString(),
      }));
    } catch (err) {
      setMsg(
        err.response?.data?.message ||
          err.message ||
          "Submission failed. Try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const addToCart = async (course) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/add`,
        { courseId: course._id },
        { withCredentials: true }
      );
      toast.success("Added to cart");
      fetchCartItems();
      navigate("/cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  useEffect(() => {
    if (course?.introVideo?.videoUrl) {
      setMainVideoUrl(course.introVideo.videoUrl);
    }
  }, [course]);

  if (!course) {
    return <p className="text-center text-gray-500 mt-6">Loading course...</p>;
  }

  const [activeTab, setActiveTab] = useState("Overview");

  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    if (!course?._id) return;
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/reviews/${course._id}`
      );
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [course]);

  const averageRating =
    reviews?.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  // for status paid ----------------------------------
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/payment/is-paid/${
            course._id
          }`,
          { withCredentials: true }
        );
        setPaid(data.paid);
      } catch (err) {
        console.log("Not logged in or error checking purchase");
      }
    })();
  }, [course._id]);

  // Helper: toggle lesson open and update mainVideoUrl; closes others automatically
  const handleLessonToggle = (lesson) => {
    const willOpen = openLessonId !== lesson._id;
    setOpenLessonId(willOpen ? lesson._id : null);
    setMainVideoUrl(
      willOpen ? lesson.lessonVideoSource : course.introVideo?.videoUrl || null
    );

    // scroll to top (smooth)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ----------------------
  // Inline Lesson Player (merged inside this file)
  // ----------------------
  const LessonItem = ({ lesson, isOpen, onToggle }) => {
    const formattedTime = `${lesson.lessonHour || 0}h ${
      lesson.lessonMinute || 0
    }m ${lesson.lessonSecond || 0}s`;

    // for quiz

    return (
      <div className="  p-1  ">
        {/* Title */}
        <div className="flex justify-between items-center">
          <div
            className="  text-gray-800 cursor-pointer hover:text-blue-600"
            onClick={() => {
              onToggle?.();

              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <span
              className={` ${
                isOpen ? "text-blue-600 font-semibold  " : "font-medium"
              }`}
            >
              {lesson.lessonTitle}
            </span>
            {/* <span className="text-sm text-gray-500 ml-2">
              ({formattedTime})
            </span> */}
          </div>
        </div>

        {/* Content */}
        <p className="text-gray-600 mt-2">{lesson.lessonContent}</p>
      </div>
    );
  };

  const content = {
    Overview: (
      <div className="px-6 md:px-12 my-6">
        <h1 className="text-xl font-bold mb-4">Description</h1>
        <p className="text-gray-600 mb-6">
          {course?.overview?.overviewDescription || course?.description}
        </p>
        <div className="flex flex-col gap-4">
          {course?.overview?.whatYouWillLearn ? (
            <p>
              <strong>What you'll learn:</strong>{" "}
              {course.overview.whatYouWillLearn}
            </p>
          ) : (
            "No Info Available"
          )}
        </div>
      </div>
    ),
    Curriculum: (
      <>
        <div>
          <div className="px-6 md:px-12 my-6">
            <h2 className="text-lg font-bold mb-4">Course Modules</h2>

            <p className="text-md font-medium mt-2 text-gray-400">
              Total Lessons:{" "}
              {course.modules?.reduce(
                (sum, module) => sum + (module.lessons?.length || 0),
                0
              ) || 0}
            </p>

            {course.modules?.length > 0 ? (
              course.modules.map((module, midx) => {
                const disabledModule = !paid;

                return (
                  <div
                    key={module._id}
                    className={`mb-6 border border-gray-200 p-4 rounded ${
                      disabledModule ? "opacity-70" : ""
                    }`}
                  >
                    {/* --- Module Title --- */}
                    <h2 className="font-bold text-md mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        Module {midx + 1}: {module.title}
                        {!paid && <FiLock className="text-gray-500 text-lg" />}
                      </span>
                      {!paid && (
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          Locked
                        </span>
                      )}
                    </h2>

                    {/* --- Lessons --- */}
                    <ul
                      className={`list-disc pl-5 space-y-1 text-sm mt-2 ${
                        disabledModule
                          ? "pointer-events-none cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {module.lessons?.length > 0 ? (
                        module.lessons.map((lesson, lidx) => (
                          <li
                            key={lesson._id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <LessonItem
                                lesson={lesson}
                                isOpen={openLessonId === lesson._id}
                                onToggle={() => {
                                  if (paid) handleLessonToggle(lesson);
                                }}
                                disabled={!paid}
                              />
                              {!paid && (
                                <FiLock className="text-gray-400 text-sm" />
                              )}
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-400 italic">
                          No lessons in this module.
                        </li>
                      )}
                    </ul>

                    {/* --- Quizzes --- */}
                    <div
                      className={`mt-4 ${!paid ? "pointer-events-none" : ""}`}
                    >
                      <h4 className="font-medium">Quizzes:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                        {module.quizzes?.length > 0 ? (
                          module.quizzes.map((q) => (
                            <li
                              key={q._id}
                              className={`flex justify-between items-center ${
                                paid
                                  ? "cursor-pointer hover:underline hover:text-blue-500"
                                  : "cursor-not-allowed text-gray-500"
                              }`}
                              onClick={() => {
                                if (paid) openModal(q); // pass full object if available
                              }}
                            >
                              <div className="flex items-center gap-2">
                                {q.title}
                                {!paid && (
                                  <FiLock className="text-gray-400 text-sm" />
                                )}
                              </div>
                              <span>{paid ? "Attempt Quiz" : "Locked"}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-400 italic">
                            No Quiz in this module.
                          </li>
                        )}
                      </ul>
                      {/* Quiz modal (mounted once per page) */}
                      <QuizModal
                        isOpen={showModal}
                        quiz={selectedQuiz}
                        onClose={() => {
                          setShowModal(false);
                          setSelectedQuiz(null);
                          setAnswers([]);
                          setResult(null);
                        }}
                        answers={answers}
                        setAnswers={setAnswers}
                        onSubmit={handleSubmit}
                        loading={loading}
                        result={result}
                      />
                    </div>

                    {/* --- Assignments --- */}
                    <div
                      className={`mt-4 ${!paid ? "pointer-events-none" : ""}`}
                    >
                      <h4 className="font-medium">Assignments:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                        {module.assignments?.length > 0 ? (
                          module.assignments.map((assignment) => (
                            <li
                              key={assignment._id}
                              className={`flex justify-between items-center ${
                                paid
                                  ? "cursor-pointer hover:underline hover:text-blue-500"
                                  : "cursor-not-allowed text-gray-500"
                              }`}
                              onClick={() => {
                                if (paid) setSelectedAssignment(assignment);
                              }}
                            >
                              <div className="flex items-center gap-2">
                                {assignment.title}
                                {!paid && (
                                  <FiLock className="text-gray-400 text-sm" />
                                )}
                              </div>
                              <span>{paid ? "full-details" : "Locked"}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-400 italic">
                            No assignments in this module.
                          </li>
                        )}
                      </ul>

                      {/* 🔹 Modal (unchanged from your version) */}
                      {selectedAssignment && (
                        <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
                          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                            {/* Close */}
                            <button
                              onClick={() => {
                                setSelectedAssignment(null);
                                setSubStatus(null);
                                setFile(null);
                                setMsg("");
                              }}
                              className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl"
                            >
                              ✖
                            </button>

                            {/* Assignment Info */}
                            <h2 className="text-xl font-bold mb-2">
                              {selectedAssignment.title}
                            </h2>
                            <p className="text-gray-700 mb-4">
                              {selectedAssignment.summary}
                            </p>

                            <h3 className="font-semibold mb-2">Questions:</h3>
                            <ul className="list-decimal pl-5 space-y-2 text-gray-600">
                              {selectedAssignment.questions?.map((q, index) => (
                                <li key={index}>{q.questionText || q}</li>
                              ))}
                            </ul>

                            <div className="border-t my-4" />

                            {/* 🔹 Status */}
                            <div className="mb-3">
                              <h4 className="font-semibold">Your submission</h4>
                              {statusLoading ? (
                                <p className="text-sm text-gray-500 mt-1">
                                  Loading status…
                                </p>
                              ) : subStatus ? (
                                <div className="text-sm mt-1 space-y-1">
                                  <p>
                                    Status:{" "}
                                    <span
                                      className={
                                        subStatus.status === "completed"
                                          ? "text-green-600 font-medium"
                                          : "text-yellow-700 font-medium"
                                      }
                                    >
                                      {subStatus.status || "pending"}
                                    </span>
                                  </p>
                                  {subStatus.submittedAt && (
                                    <p className="text-gray-600">
                                      Submitted:{" "}
                                      {new Date(
                                        subStatus.submittedAt
                                      ).toLocaleString()}
                                    </p>
                                  )}
                                  {subStatus.pdfUrl && (
                                    <div className="flex flex-col sm:flex-row gap-2">
                                      <p className="font-medium text-slate-700">
                                        PDF:
                                      </p>
                                      <div className="flex gap-3">
                                        <a
                                          href={subStatus.pdfUrl}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-blue-600 underline"
                                        >
                                          View
                                        </a>
                                        <a
                                          href={subStatus.pdfUrl}
                                          download
                                          className="text-green-600 underline"
                                        >
                                          Download
                                        </a>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500 mt-1">
                                  No submission yet (pending).
                                </p>
                              )}
                            </div>

                            {/* 🔹 Upload Form */}
                            <div className="space-y-2">
                              <label className="block text-sm font-medium">
                                Upload PDF
                              </label>
                              <input
                                type="file"
                                accept="application/pdf"
                                onChange={onFileChange}
                                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                              />
                              {file && (
                                <p className="text-xs text-gray-500">
                                  Selected: {file.name} (
                                  {(file.size / (1024 * 1024)).toFixed(2)} MB)
                                </p>
                              )}

                              {msg && (
                                <p
                                  className={`text-sm ${
                                    msg.startsWith("✅")
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {msg}
                                </p>
                              )}

                              <div className="flex items-center gap-2 pt-2">
                                <button
                                  disabled={uploading || !file}
                                  onClick={onSubmit}
                                  className={`px-4 py-2 rounded-md text-white ${
                                    uploading || !file
                                      ? "bg-blue-300 cursor-not-allowed"
                                      : "bg-blue-600 hover:bg-blue-700"
                                  }`}
                                >
                                  {uploading
                                    ? "Submitting…"
                                    : subStatus?.status === "completed"
                                    ? "Re-submit PDF"
                                    : "Submit PDF"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">No modules found for this course.</p>
            )}
          </div>
        </div>
      </>
    ),
    Instructor: (
      <div className="px-6 md:px-12 my-6">
        <div className="flex flex-col md:flex-row p-4 gap-4 items-center">
          {/* Avatar or Fallback */}
          {course.instructor?.avatar ? (
            <img
              src={course.instructor.avatar}
              alt="Instructor"
              className="w-40 h-40 object-cover rounded-full shadow-md border"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-500 text-white flex items-center justify-center text-5xl font-bold shadow-md">
              {course.instructor?.name?.[0]?.toUpperCase() || "U"}
            </div>
          )}

          {/* Instructor Info */}
          <div className="flex flex-col gap-3">
            <h1 className="text-xl font-semibold">
              <span className="font-bold text-gray-700">Instructor :</span>{" "}
              {course.instructor?.name || "Unknown Instructor"}
            </h1>

            <p className="font-semibold">
              <span className="font-bold text-gray-700">Occupation :</span>{" "}
              {course.instructor?.profile?.skill || "No skills listed"}
            </p>

            <p className="text-gray-600">
              <span className="font-bold text-gray-700">Bio :</span>{" "}
              {course.instructor?.profile?.bio || "No bio available"}
            </p>
          </div>
        </div>
      </div>
    ),
    Review: (
      <div className="px-6 md:px-12 my-6">
        {course.reviews.length === 0 && (
          <p className="text-gray-500 italic">
            No reviews yet. Be the first to review this course!
          </p>
        )}

        {course.reviews.map((review, index) => (
          <div
            key={index}
            className="flex items-start gap-4 pb-4 mb-4  border-gray-200"
          >
            <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
              {review.userId?.name?.[0]?.toUpperCase() || "U"}
            </div>

            <div className="flex-1 ">
              <div className="flex  gap-2 items-center ">
                <h1 className="text-sm font-semibold">
                  {review.userId?.name
                    ? review.userId.name.charAt(0).toUpperCase() +
                      review.userId.name.slice(1).toLowerCase()
                    : "Unknown"}
                </h1>
                <p className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              <p className=" text-gray-700 leading-relaxed text-sm">
                {review.comment}
              </p>

              <div className="flex gap-1  text-yellow-400 text-sm">
                {Array.from({ length: 5 }, (_, i) => {
                  if (i < Math.floor(review.rating)) return <FaStar key={i} />;
                  if (i < review.rating) return <FaRegStarHalfStroke key={i} />;
                  return <FaRegStar key={i} />;
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
    Announcement: (
      <>
        <div className="mb-8">
          {course.announcement?.length > 0 ? (
            <div className="mt-2">
              <h4 className="font-medium text-gray-700"> Announcements:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {[...course.announcement].reverse().map((ann) => (
                  <li key={ann._id}>
                    {ann.title}{" "}
                    <span className="text-xs text-gray-400">
                      ({new Date(ann.createdAt).toLocaleDateString()})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No announcements yet.</p>
          )}
        </div>
      </>
    ),
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <div className="max-w-screen-2xl mx-auto">
        <div className="p-3">
          {/* Show mainVideoUrl if playable, otherwise fallback to thumbnail image */}
          {mainVideoUrl && ReactPlayer.canPlay(mainVideoUrl) ? (
            <ReactPlayer
              url={mainVideoUrl}
              controls
              width="100%"
              height="70vh" // increased height for hero
              className="rounded object-contain"
            />
          ) : (
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}${course.thumbnail}`}
              alt="Course Banner"
              className="h-[70vh] w-full object-cover object-center rounded"
            />
          )}
        </div>

        <div className="relative">
          <div className="shadow-lg bg-white px-6 py-4 max-w-3xl md:mx-6 mx-auto rounded-xl  md:-mt-10">
            <h1 className="text-2xl font-bold mb-3">{course.title}</h1>
            <div className="flex flex-wrap md:flex-nowrap gap-6">
              <div className="flex-1">
                <h3 className="text-gray-500">Instructor</h3>
                <p className="font-semibold">{course.instructor.name}</p>
              </div>
              <div className="flex-1">
                <h3 className="text-gray-500">Category</h3>
                <p className="font-semibold"> {course.categories}</p>
              </div>
              <div className="flex-1">
                <h3 className="text-gray-500">Review</h3>
                <div className="flex items-center gap-1 text-amber-300">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>
                      {i < Math.round(averageRating) ? "⭐" : ""}
                    </span>
                  ))}
                  ({averageRating})
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 px-6 md:px-12 my-12">
          <div className="flex-1">
            <div className="flex gap-4 border-b mb-6 overflow-x-auto">
              {[
                "Overview",
                "Curriculum",
                "Instructor",
                "Review",
                "Announcement",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 md:px-4 px-3 font-medium ${
                    activeTab === tab
                      ? "border-b-2 border-blue-500 text-blue-500"
                      : "border-transparent text-gray-600 hover:text-blue-500"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div>{content[activeTab]}</div>
          </div>

          <aside className="w-full md:w-[400px] flex-shrink-0 p-4 rounded-xl bg-white lg:-mt-43 -mt-10 shadow-sm">
            {/* Course Includes */}
            <h3 className="text-xl font-semibold mb-3">This Course Includes</h3>

            <div className="flex flex-col gap-2 text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>On-demand video</span>
                <span>{course?.overview?.videoHours ?? 5} hrs</span>
              </div>

              <div className="flex justify-between">
                <span>Instructor</span>
                <span>{course.instructor?.name}</span>
              </div>

              <div className="flex justify-between">
                <span>Language</span>
                <span>
                  {course?.overview?.overviewLanguage || "Hindi, English"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Level</span>
                <span>{course?.overview?.courseLevel || "Beginner"}</span>
              </div>

              <div className="flex justify-between">
                <span>Certificate</span>
                <span>{course?.overview?.certificate ? "✅" : "❌"}</span>
              </div>

              <div className="flex justify-between">
                <span>Mobile & TV</span>
                <span>
                  {course?.overview?.accessOnMobileAndTV ? "✅" : "❌"}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {/* <MdCurrencyRupee className="h-6 w-6" /> */}
                <span className="text-2xl font-bold">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(Number(course?.discountPrice ?? 0))}
                </span>
              </div>

              {/* optional small note or badge */}
              {course?.originalPrice &&
                course.originalPrice > course.discountPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    }).format(Number(course.originalPrice))}
                  </span>
                )}
            </div>

            {/* CTA */}
            <button
              onClick={() => addToCart(course)}
              aria-label={`Add ${course?.title || "course"} to cart`}
              className={`w-full py-3 rounded-lg mb-4  font-medium ${
                paid
                  ? "text-black border border-green-400 cursor-not-allowed"
                  : "bg-blue-700 hover:bg-blue-800 text-white cursor-pointer"
              }`}
              disabled={paid}
            >
              {paid ? "Enrolled " : "Add To Cart"}
            </button>

            {/* Share block */}
            <div className="mt-2 ">
              <h4 className="font-semibold mb-2">Share</h4>

              <div className="flex  items-center gap-3 ">
                {/* Copy link */}
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(window.location.href);
                      toast.success("Course link copied to clipboard");
                    } catch {
                      toast.info(
                        "Copy failed — please copy the URL from the address bar"
                      );
                    }
                  }}
                  className="px-3 py-2 bg-gray-50 border rounded-md text-sm hover:bg-gray-100 cursor-pointer"
                  aria-label="Copy course link"
                  title="Copy course link"
                >
                  Copy link
                </button>

                {/* Native share (mobile) */}
                <button
                  onClick={async () => {
                    if (navigator.share) {
                      try {
                        await navigator.share({
                          title: course?.title,
                          text:
                            course?.overview?.overviewDescription ||
                            course?.title,
                          url: window.location.href,
                        });
                      } catch {
                        /* user cancelled or error */
                      }
                    } else {
                      toast.info(
                        "Native share is not available on this device"
                      );
                    }
                  }}
                  className="px-3 py-2 bg-gray-50 border rounded-md text-sm hover:bg-gray-100  cursor-pointer"
                  aria-label="Share (native)"
                  title="Share (native)"
                >
                  Share
                </button>
              </div>
            </div>
          </aside>
        </div>

        <div className="px-6 md:px-12 my-20 text-center">
          <h2 className="text-blue-500 text-sm">Explore Recommended Courses</h2>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            You Might Also Like
          </h1>
          <p className="text-gray-600 mb-12">
            Discover personalized course recommendations curated to match your
            interests and learning goals.
          </p>

        </div>
          <Card all_course={all_course.slice(0, 3)} />
        <ToastContainer position="top-right" autoClose={1000} />
      </div>
    </>
  );
};

export default CourseDetails;
