// // src/pages/Admin/AdminCourseDetails.jsx
// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { FaStar, FaRegStar, FaEdit, FaTrash } from "react-icons/fa";
// import { FaRegStarHalfStroke, FaX } from "react-icons/fa6";
// import avatar from "../../../assets/image/avatar.png";
// import { MdCurrencyRupee } from "react-icons/md";
// import { FaDribbble, FaLinkedin, FaTwitter } from "react-icons/fa";
// import ReactPlayer from "react-player";
// import LessonVideoPlayer from "../../../courseUpload/LassonVideoPlayer";
// import EditCourseModal from "../../../courseUpload/CourseEdit";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import ModuleForm from "../../../Instructor-courseUpload/ModuleForm";
// import LessonForm from "../../../courseUpload/LessonForm";
// import { FiX } from "react-icons/fi";

// const AdminCourseDetails = () => {
//   const location = useLocation();
//   const course = location.state;

//   const [updatedCourse, setUpdatedCourse] = useState(course);

//   const [editModuleId, setEditModuleId] = useState(null);

//   const [openRemark, setOpenRemark] = useState(false);

//   const [openLessonId , setOpenLessonId] = useState(null)

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   const [activeTab, setActiveTab] = useState("Overview");

//   if (!course) {
//     return (
//       <div className="text-center text-red-600 font-bold p-10">
//         ❌ Course not found!
//       </div>
//     );
//   }

//   const navigate = useNavigate();

//   const handleDelete = async () => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this course?"
//     );
//     if (!confirmDelete) return;

//     try {
//       const res = await axios.delete(
//         `${import.meta.env.VITE_BACKEND_URL}/api/courses/delete/${course._id}`
//       );

//       if (res.status === 200) {
//         toast.success("✅ Course deleted!");
//         navigate("/admin/enrollCourse");
//         // Optionally remove course from list or refresh
//       } else {
//         toast.error("❌ Could not delete course");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("❌ Failed to delete course");
//     }
//   };

//   //    Status change draft to pending
//   const handleStatusChange = async (newStatus) => {
//     try {
//       const res = await axios.put(
//         `${import.meta.env.VITE_BACKEND_URL}/api/instructor-courses/${
//           course._id
//         }/status`,
//         { status: newStatus },
//         {
//           withCredentials: true,
//         }
//       );

//       toast.success(`Status updated to ${newStatus}`);
//       console.log(res.data.course);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Error updating status");
//     }
//   };

//   //   Status change pending to Published (for admin)
//   const handleApprove = async () => {
//     try {
//       const res = await axios.put(
//         `${import.meta.env.VITE_BACKEND_URL}/api/instructor-courses/${
//           course._id
//         }/status`,
//         { status: "Published" },
//         { withCredentials: true } // ✅ if using cookies
//       );

//       toast.success("Course has been published 🎉");
//       console.log(res.data.course);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Error publishing course");
//     }
//   };

//   // Add remark
//   const [addRemark, setAddRemark] = useState("");

//   const handleSubmitRemark = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/remark/${course._id}`,
//         { courseRemark: addRemark } // ✅ send object with key
//       );

//       toast.success("Remark added ");
//       setAddRemark(""); // clear input after success
//     } catch (error) {
//       toast.error("Failed to add remark ");
//     }
//   };

//   const averageRating =
//     course.reviews && course.reviews.length > 0
//       ? (
//           course.reviews.reduce((sum, review) => sum + review.rating, 0) /
//           course.reviews.length
//         ).toFixed(1)
//       : null;

//   const content = {
//     Overview: (
//       <div className="px-6 md:px-12 my-6">
//         <h1 className="text-xl font-bold mb-4">Description</h1>
//         <p className="text-gray-600 mb-6">
//           {course?.overview?.overviewDescription ||
//             course.description ||
//             "No Description"}
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
//       <div className="px-6 md:px-12 my-6">
//         <h2 className="text-xl font-bold mb-4">Course Modules</h2>

//         <p className="text-md font-medium mt-2 text-gray-400">
//           Total Lessons:{" "}
//           {updatedCourse.modules?.reduce(
//             (sum, module) => sum + (module.lessons?.length || 0),
//             0
//           ) || 0}
//         </p>

//         {updatedCourse.modules?.map((module) => (
//           <div
//             key={module._id}
//             className="mt-4 border border-gray-200 p-4 rounded"
//           >
//             <div className="flex items-center justify-between">
//               {editModuleId === module._id ? (
//                 ""
//               ) : (
//                 <p className="font-semibold ">{module.title}</p>
//               )}

//               <div className="flex items-center gap-2"></div>
//             </div>

//             <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
//               {module.lessons?.length > 0 ? (
//                 module.lessons.map((lesson) => (
//                   <LessonVideoPlayer
//                     key={lesson._id}
//                     lesson={lesson}
//                     modules={updatedCourse.modules}
//                     isOpen = {openLessonId === lesson._id}
//                     onToggle = {()=> setOpenLessonId(openLessonId === lesson._id ? null : lesson._id)}
//                   />
//                 ))
//               ) : (
//                 <li className="text-gray-400 italic">
//                   No lessons in this module.
//                 </li>
//               )}
//             </ul>
//           </div>
//         ))}
//       </div>
//     ),

//     Instructor: (
//       <div className="px-6 md:px-12 my-6 ">
//         <div className="flex justify-center p-4 gap-2  items-center">
//           <img src={avatar} alt="Instructor" className="w-40 mx-auto md:mx-0" />
//           <div className="flex flex-col gap-3">
//             <h1 className="text-xl font-bold">{course.instructor.name}</h1>

//             <p className=" font-semibold">
//               <span className="font-bold text-gray-700">Occupation :</span>{" "}
//               {course.instructor.profile?.skill || "No skills listed"}
//             </p>

//             <p className="text-gray-600">
//               <span className="font-bold text-gray-700">Bio :</span>{" "}
//               {course.instructor.profile?.bio || "No bio available"}
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
//             className="flex flex-col md:flex-row items-start gap-4 mb-6 p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition"
//           >
//             {/* Avatar */}
//             <div className="h-12 w-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
//               {review.userId?.name?.[0]?.toUpperCase() || "U"}
//             </div>

//             {/* Review Content */}
//             <div className="flex-1">
//               {/* Name + Date */}
//               <div className="flex justify-between items-center">
//                 <h1 className="text-lg font-semibold">
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
//               <p className="mt-2 text-gray-700 leading-relaxed">
//                 {review.comment}
//               </p>

//               {/* Rating */}
//               <div className="flex gap-1 mt-2 text-yellow-400">
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

//     Remark : (
//       <div className="mb-8">
//   <h2 className="text-xl font-semibold mt-6">Remarks :</h2>

//   {course.remarks?.length > 0 ? (
//     <div className="mt-3 space-y-6">
//       {/* ✅ Pending Remarks */}
//       <div>
//         <h3 className="font-medium text-red-600">Pending</h3>
//         <ul className="mt-2 space-y-2">
//           {course.remarks
//             .filter((r) => r.status === "Pending")
//             .map((r) => (
//               <li
//                 key={r._id}
//                 className="border border-gray-400 p-2 rounded-md "
//               >
//                 <p>{r.courseRemark}</p>
//                 {/* <span className="text-sm text-gray-500">
//                   Status: {r.status}
//                 </span> */}
//               </li>
//             ))}
//           {course.remarks.filter((r) => r.status === "Pending").length === 0 && (
//             <p className="text-sm text-gray-400">No pending remarks.</p>
//           )}
//         </ul>
//       </div>

//       {/* ✅ Done Remarks */}
//       <div>
//         <h3 className="font-medium text-green-600"> Done</h3>
//         <ul className="mt-2 space-y-2">
//           {course.remarks
//             .filter((r) => r.status === "Done")
//             .map((r) => (
//               <li
//                 key={r._id}
//                 className="border border-gray-400 p-2 rounded-md "
//               >
//                 <p>{r.courseRemark}</p>
//                 {/* <span className="text-sm text-gray-500">
//                   Status: {r.status}
//                 </span> */}
//               </li>
//             ))}
//           {course.remarks.filter((r) => r.status === "Done").length === 0 && (
//             <p className="text-sm text-gray-400">No done remarks.</p>
//           )}
//         </ul>
//       </div>
//     </div>
//   ) : (
//     <p>No remarks yet.</p>
//   )}
// </div>

//     )
//   };

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
//               <div className="flex items-center gap-1">
//                 <FaRegStar className="w-3 h-3 text-amber-400" />
//                 <span className="text-gray-700 font-medium">
//                   {averageRating || "New"}
//                 </span>
//                 {course.reviews && course.reviews.length > 0 && (
//                   <span className="text-gray-400 ml-1">
//                     ({course.reviews.length})
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-col md:flex-row gap-8 px-6 md:px-12 my-12">
//         <div className="flex-1">
//           <div className="flex gap-4 border-b mb-6 overflow-x-auto">
//             {["Overview", "Curriculum", "Instructor", "Review" , "Remark"].map((tab) => (
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
//           {course.introVideo?.videoUrl &&
//             ReactPlayer.canPlay(course.introVideo.videoUrl) && (
//               <div>
//                 <h3 className="text-lg font-semibold mb-2">
//                   📽️ Course Intro Video
//                 </h3>
//                 <ReactPlayer
//                   url={course.introVideo.videoUrl}
//                   controls
//                   width="100%"
//                   height="360px"
//                 />
//               </div>
//             )}
//           <div className="flex items-center ">
//             <MdCurrencyRupee className="h-6 w-6" />
//             <h2 className="text-2xl font-bold">{course.discountPrice}</h2>
//           </div>
//           <p className="text-xl font-semibold mb-2"> This Course Includes </p>
//           <div className="flex flex-col gap-2 text-gray-600">
//             <p>✅ {course?.overview?.videoHours || 5}hrs on-demand video</p>
//             <p>
//               ✅ Instructor:{" "}
//               { course.instructor.name}
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
//           <div className="mt-4">
//             <p>
//               <strong>Current Status:</strong> {course.status}
//             </p>

//             {course.status === "Draft" && (
//               <button
//                 onClick={() => handleStatusChange("Pending")}
//                 className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
//               >
//                 Send for Review
//               </button>
//             )}

//             {course.status === "Pending" && (
//               <>
//                 <p className="text-yellow-600 font-semibold mt-2">
//                   Waiting for approval...
//                 </p>
//                 <button
//                   onClick={handleApprove}
//                   className="bg-green-600 text-white px-4 py-2 rounded mt-2"
//                 >
//                   Approve & Publish
//                 </button>
//               </>
//             )}

//             {course.status === "Published" && (
//               <p className="text-green-600 font-semibold mt-2">Live ✅</p>
//             )}
//           </div>

//           <div className="mt-4">
//             {course.status === "Pending" && (
//               <>
//                 {/* <button
//                   className="border w-full p-1 text-blue-500 hover:bg-red-600  hover:text-white rounded-lg mt-2 cursor-pointer "
//                   onClick={handleDelete}
//                 >
//                   Delete Course
//                 </button> */}
//                 <button
//                   className="border w-full p-1 text-blue-500 hover:bg-blue-600 hover:text-white rounded-lg mt-2 cursor-pointer"
//                   onClick={() => setOpenRemark(true)}
//                 >
//                   Remark
//                 </button>
//                 {openRemark && (
//                   <div className="border mt-2 p-2">
//                     <p className="text-center font-semibold text-lg">
//                       Add remark{" "}
//                     </p>
//                     <div
//                       className="flex justify-end cursor-pointer  "
//                       onClick={() => setOpenRemark(false)}
//                     >
//                       <FaX color="red" />
//                     </div>
//                     <form
//                       onSubmit={handleSubmitRemark}
//                       className="flex gap-2 mt-4"
//                     >
//                       <input
//                         type="text"
//                         value={addRemark}
//                         onChange={(e) => setAddRemark(e.target.value)}
//                         placeholder="Write a remark..."
//                         className="border px-3 py-2 rounded-md w-full"
//                         required
//                       />
//                       <button
//                         type="submit"
//                         className="bg-blue-600 text-white px-4 py-2 rounded-md"
//                       >
//                         Add
//                       </button>
//                     </form>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//           <ToastContainer position="top-right" autoClose={2000} />
//         </aside>
//       </div>
//     </>
//   );
// };

// export default AdminCourseDetails;


// src/pages/Admin/AdminCourseDetails.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaStar, FaRegStar, FaEdit, FaTrash } from "react-icons/fa";
import { FaRegStarHalfStroke, FaX } from "react-icons/fa6";
import avatar from "../../../assets/image/avatar.png";
import { MdCurrencyRupee } from "react-icons/md";
import { FaDribbble, FaLinkedin, FaTwitter } from "react-icons/fa";
import ReactPlayer from "react-player";
import LessonVideoPlayer from "../../../courseUpload/LassonVideoPlayer";
import EditCourseModal from "../../../courseUpload/CourseEdit";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModuleForm from "../../../Instructor-courseUpload/ModuleForm";
import LessonForm from "../../../courseUpload/LessonForm";
import { FiX } from "react-icons/fi";

const AdminCourseDetails = () => {
  const location = useLocation();
  const course = location.state;

  const [updatedCourse, setUpdatedCourse] = useState(course);

  const [editModuleId, setEditModuleId] = useState(null);

  const [openRemark, setOpenRemark] = useState(false);

  const [openLessonId , setOpenLessonId] = useState(null)

  // mainVideoUrl will control the top area (intro video by default)
  const [mainVideoUrl, setMainVideoUrl] = useState(
    course?.introVideo?.videoUrl || null
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // If course changes (unlikely), update default main video
    setMainVideoUrl(course?.introVideo?.videoUrl || null);
    setUpdatedCourse(course);
  }, [course]);

  const [activeTab, setActiveTab] = useState("Overview");

  if (!course) {
    return (
      <div className="text-center text-red-600 font-bold p-10">
        ❌ Course not found!
      </div>
    );
  }

  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/courses/delete/${course._id}`
      );

      if (res.status === 200) {
        toast.success("✅ Course deleted!");
        navigate("/admin/enrollCourse");
        // Optionally remove course from list or refresh
      } else {
        toast.error("❌ Could not delete course");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete course");
    }
  };

  //    Status change draft to pending
  const handleStatusChange = async (newStatus) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/instructor-courses/${
          course._id
        }/status`,
        { status: newStatus },
        {
          withCredentials: true,
        }
      );

      toast.success(`Status updated to ${newStatus}`);
      console.log(res.data.course);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating status");
    }
  };

  //   Status change pending to Published (for admin)
  const handleApprove = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/instructor-courses/${
          course._id
        }/status`,
        { status: "Published" },
        { withCredentials: true } // ✅ if using cookies
      );

      toast.success("Course has been published 🎉");
      console.log(res.data.course);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error publishing course");
    }
  };

  // Add remark
  const [addRemark, setAddRemark] = useState("");

  const handleSubmitRemark = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/remark/${course._id}`,
        { courseRemark: addRemark } // ✅ send object with key
      );

      toast.success("Remark added ");
      setAddRemark(""); // clear input after success
    } catch (error) {
      toast.error("Failed to add remark ");
    }
  };

  const averageRating =
    course.reviews && course.reviews.length > 0
      ? (
          course.reviews.reduce((sum, review) => sum + review.rating, 0) /
          course.reviews.length
        ).toFixed(1)
      : null;

  const content = {
    Overview: (
      <div className="px-6 md:px-12 my-6">
        <h1 className="text-xl font-bold mb-4">Description</h1>
        <p className="text-gray-600 mb-6">
          {course?.overview?.overviewDescription ||
            course.description ||
            "No Description"}
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
      <div className="px-6 md:px-12 my-6">
        <h2 className="text-xl font-bold mb-4">Course Modules</h2>

        <p className="text-md font-medium mt-2 text-gray-400">
          Total Lessons:{" "}
          {updatedCourse.modules?.reduce(
            (sum, module) => sum + (module.lessons?.length || 0),
            0
          ) || 0}
        </p>

        {updatedCourse.modules?.map((module) => (
          <div
            key={module._id}
            className="mt-4 border border-gray-200 p-4 rounded"
          >
            <div className="flex items-center justify-between">
              {editModuleId === module._id ? (
                ""
              ) : (
                <p className="font-semibold ">{module.title}</p>
              )}

              <div className="flex items-center gap-2"></div>
            </div>

            <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
              {module.lessons?.length > 0 ? (
                module.lessons.map((lesson) => (
                  <LessonVideoPlayer
                    key={lesson._id}
                    lesson={lesson}
                    modules={updatedCourse.modules}
                    isOpen = {openLessonId === lesson._id}
                    onToggle = {() => {
                      const willOpen = openLessonId !== lesson._id;
                      setOpenLessonId(willOpen ? lesson._id : null);
                      setMainVideoUrl(
                        willOpen
                          ? lesson.lessonVideoSource
                          : course.introVideo?.videoUrl || null
                      );
                    }}
                  />
                ))
              ) : (
                <li className="text-gray-400 italic">
                  No lessons in this module.
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
    ),

    Instructor: (
      <div className="px-6 md:px-12 my-6 ">
        <div className="flex justify-center p-4 gap-2  items-center">
          <img src={avatar} alt="Instructor" className="w-40 mx-auto md:mx-0" />
          <div className="flex flex-col gap-3">
            <h1 className="text-xl font-bold">{course.instructor.name}</h1>

            <p className=" font-semibold">
              <span className="font-bold text-gray-700">Occupation :</span>{" "}
              {course.instructor.profile?.skill || "No skills listed"}
            </p>

            <p className="text-gray-600">
              <span className="font-bold text-gray-700">Bio :</span>{" "}
              {course.instructor.profile?.bio || "No bio available"}
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
            className="flex flex-col md:flex-row items-start gap-4 mb-6 p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition"
          >
            {/* Avatar */}
            <div className="h-12 w-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
              {review.userId?.name?.[0]?.toUpperCase() || "U"}
            </div>

            {/* Review Content */}
            <div className="flex-1">
              {/* Name + Date */}
              <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold">
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

              {/* Comment */}
              <p className="mt-2 text-gray-700 leading-relaxed">
                {review.comment}
              </p>

              {/* Rating */}
              <div className="flex gap-1 mt-2 text-yellow-400">
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

    Remark : (
      <div className="mb-8">
  <h2 className="text-xl font-semibold mt-6">Remarks :</h2>

  {course.remarks?.length > 0 ? (
    <div className="mt-3 space-y-6">
      {/* ✅ Pending Remarks */}
      <div>
        <h3 className="font-medium text-red-600">Pending</h3>
        <ul className="mt-2 space-y-2">
          {course.remarks
            .filter((r) => r.status === "Pending")
            .map((r) => (
              <li
                key={r._id}
                className="border border-gray-400 p-2 rounded-md "
              >
                <p>{r.courseRemark}</p>
                {/* <span className="text-sm text-gray-500">
                  Status: {r.status}
                </span> */}
              </li>
            ))}
          {course.remarks.filter((r) => r.status === "Pending").length === 0 && (
            <p className="text-sm text-gray-400">No pending remarks.</p>
          )}
        </ul>
      </div>

      {/* ✅ Done Remarks */}
      <div>
        <h3 className="font-medium text-green-600"> Done</h3>
        <ul className="mt-2 space-y-2">
          {course.remarks
            .filter((r) => r.status === "Done")
            .map((r) => (
              <li
                key={r._id}
                className="border border-gray-400 p-2 rounded-md "
              >
                <p>{r.courseRemark}</p>
                {/* <span className="text-sm text-gray-500">
                  Status: {r.status}
                </span> */}
              </li>
            ))}
          {course.remarks.filter((r) => r.status === "Done").length === 0 && (
            <p className="text-sm text-gray-400">No done remarks.</p>
          )}
        </ul>
      </div>
    </div>
  ) : (
    <p>No remarks yet.</p>
  )}
</div>

    )
  };

  return (
    <>
      <div className="p-3  ">
        {/* Show mainVideoUrl if playable, otherwise fallback to thumbnail image */}
        {mainVideoUrl && ReactPlayer.canPlay(mainVideoUrl) ? (
          <ReactPlayer
            url={mainVideoUrl}
            controls
            width="100%"
            height="70vh"
            className="max-h-[70vh] rounded object-contain "
          />
        ) : (
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}${course.thumbnail}`}
            alt="Course Banner"
            className="h-[50vh] md:h-[70vh] w-full object-contain object-center rounded"
          />
        )}
      </div>

      <div className="relative  ">
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
              <div className="flex items-center gap-1">
                <FaRegStar className="w-3 h-3 text-amber-400" />
                <span className="text-gray-700 font-medium">
                  {averageRating || "New"}
                </span>
                {course.reviews && course.reviews.length > 0 && (
                  <span className="text-gray-400 ml-1">
                    ({course.reviews.length})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 px-6 md:px-12 my-12">
        <div className="flex-1">
          <div className="flex gap-4 border-b mb-6 overflow-x-auto">
            {["Overview", "Curriculum", "Instructor", "Review" , "Remark"].map((tab) => (
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

        <aside className="w-full md:w-[400px] flex-shrink-0  p-4 rounded-xl bg-white lg:-mt-43 -mt-10 mb-4 ">
          {/* <img src={video} alt="Demo Video" className="rounded-md mb-6" /> */}
          {/* Keep the intro video logic in the aside too if you want it repeated — currently mainVideoUrl handles the top area */}
          <div className="flex items-center ">
            <MdCurrencyRupee className="h-6 w-6" />
            <h2 className="text-2xl font-bold">{course.discountPrice}</h2>
          </div>
          <p className="text-xl font-semibold mb-2"> This Course Includes </p>
          <div className="flex flex-col gap-2 text-gray-600">
            <p>✅ {course?.overview?.videoHours || 5}hrs on-demand video</p>
            <p>
              ✅ Instructor:{" "}
              { course.instructor.name}
            </p>
            <p>
              ✅ Language:{" "}
              {course?.overview?.overviewLanguage || "Hindi,English"}
            </p>
            <p>✅ Level:{course?.overview?.courseLevel || "Beginner"}</p>
            <p>
              {course?.overview?.certificate ? "✅ " : "❌ "}
              Certificate
            </p>
            <p>
              {course?.overview?.accessOnMobileAndTV ? "✅ " : "❌ "}
              Access on Mobile & TV
            </p>
          </div>
          <div className="flex items-center gap-3 mt-6">
            <h3 className="font-bold">Share:</h3>
            <a href="#" className="p-2 bg-gray-300 rounded-full">
              <FaDribbble />
            </a>
            <a href="#" className="p-2 bg-gray-300 rounded-full">
              <FaLinkedin />
            </a>
            <a href="#" className="p-2 bg-gray-300 rounded-full">
              <FaTwitter />
            </a>
          </div>
          <div className="mt-4">
            <p>
              <strong>Current Status:</strong> {course.status}
            </p>

            {course.status === "Draft" && (
              <button
                onClick={() => handleStatusChange("Pending")}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                Send for Review
              </button>
            )}

            {course.status === "Pending" && (
              <>
                <p className="text-yellow-600 font-semibold mt-2">
                  Waiting for approval...
                </p>
                <button
                  onClick={handleApprove}
                  className="bg-green-600 text-white px-4 py-2 rounded mt-2"
                >
                  Approve & Publish
                </button>
              </>
            )}

            {course.status === "Published" && (
              <p className="text-green-600 font-semibold mt-2">Live ✅</p>
            )}
          </div>

          <div className="mt-4">
            {course.status === "Pending" && (
              <>
                {/* <button
                  className="border w-full p-1 text-blue-500 hover:bg-red-600  hover:text-white rounded-lg mt-2 cursor-pointer "
                  onClick={handleDelete}
                >
                  Delete Course
                </button> */}
                <button
                  className="border w-full p-1 text-blue-500 hover:bg-blue-600 hover:text-white rounded-lg mt-2 cursor-pointer"
                  onClick={() => setOpenRemark(true)}
                >
                  Remark
                </button>
                {openRemark && (
                  <div className="border mt-2 p-2">
                    <p className="text-center font-semibold text-lg">
                      Add remark{" "}
                    </p>
                    <div
                      className="flex justify-end cursor-pointer  "
                      onClick={() => setOpenRemark(false)}
                    >
                      <FaX color="red" />
                    </div>
                    <form
                      onSubmit={handleSubmitRemark}
                      className="flex gap-2 mt-4"
                    >
                      <input
                        type="text"
                        value={addRemark}
                        onChange={(e) => setAddRemark(e.target.value)}
                        placeholder="Write a remark..."
                        className="border px-3 py-2 rounded-md w-full"
                        required
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md"
                      >
                        Add
                      </button>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
          <ToastContainer position="top-right" autoClose={2000} />
        </aside>
      </div>
    </>
  );
};

export default AdminCourseDetails;
