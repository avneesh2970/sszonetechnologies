// import React, { useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { MdCancel } from "react-icons/md";
// import { useEffect } from "react";

// const EditCourseModal = ({ course, onClose, onUpdated }) => {
//   const [form, setForm] = useState({
//     title: "",
//     slug: "",
//     description: "",
//     regularPrice: "",
//     discountPrice: "",
//     categories: "",
//     thumbnail: "", // File
//     thumbnailPreview: "", // For live preview
//   });

//   useEffect(() => {
//     if (course) {
//       setForm({
//         title: course.title || "",
//         slug: course.slug || "",
//         description: course.description || "",
//         regularPrice: course.regularPrice || "",
//         discountPrice: course.discountPrice || "",
//         categories: Array.isArray(course.categories)
//           ? course.categories.join(",")
//           : course.categories || "",
//         thumbnail: "",
//         thumbnailPreview: course.thumbnail || "",
//       });
//     }
//   }, [course]);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "thumbnail") {
//       const file = files[0];
//       setForm((prev) => ({
//         ...prev,
//         thumbnail: file,
//         thumbnailPreview: URL.createObjectURL(file),
//       }));
//     } else {
//       setForm((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const formData = new FormData();

//       formData.append("title", form.title);
//       formData.append("slug", form.slug);
//       formData.append("description", form.description);
//       formData.append("regularPrice", form.regularPrice);
//       formData.append("discountPrice", form.discountPrice);
//       formData.append("categories", form.categories);
//       if (form.thumbnail) formData.append("thumbnail", form.thumbnail);

//       const res = await axios.put(
//         `${import.meta.env.VITE_BACKEND_URL}/api/instructor-courses/update/${
//           course._id
//         }`,
//         formData,
//         {
//           withCredentials: true,
//         }
//       );

//       toast.success(res.data.message);
//       // onUpdated(res.data.course);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Update failed");
//     }
//   };

//   // //   Addition Update

//   const [additionalInfo, setAdditionalInfo] = useState({
//   language: "",
//   startDate: "",
//   requirements: "",
//   description: "",
//   durationHour: "",
//   durationMinute: "",
//   tags: "",
// });

//   // Prefill
//   useEffect(() => {
//   if (course && course.additionalInfo) {
//     setAdditionalInfo({
//       language: course.additionalInfo.language || "",
//       startDate: course.additionalInfo.startDate
//         ? course.additionalInfo.startDate.split("T")[0]
//         : "",
//       requirements: course.additionalInfo.requirements || "",
//       description: course.additionalInfo.description || "",
//       durationHour: course.additionalInfo.duration?.hour || "",
//       durationMinute: course.additionalInfo.duration?.minute || "",
//       tags: Array.isArray(course.additionalInfo.tags)
//         ? course.additionalInfo.tags.join(", ")
//         : course.additionalInfo.tags || "",
//     });
//   }
// }, [course]);

//   // 🔹 handleChangeAdditional
//   const handleChangeAdditional = (e) => {
//     const { name, value } = e.target;
//     setAdditionalInfo((prev) => ({ ...prev, [name]: value }));
//   };

//   // 🔹 handleSubmitAdditional
//   const handleSubmitAdditional = async (e) => {
//   e.preventDefault();
//   try {
//     await axios.put(
//       `${import.meta.env.VITE_BACKEND_URL}/api/instructor-courses/${course._id}/additional-info`,
//       {
//         ...additionalInfo,
//         duration: {
//           hour: Number(additionalInfo.durationHour),
//           minute: Number(additionalInfo.durationMinute),
//         },
//         tags: additionalInfo.tags
//           ? additionalInfo.tags.split(",").map((t) => t.trim())
//           : [],
//       },
//       { withCredentials: true }
//     );

//     toast.success("Additional Info updated successfully 🎉");
//   } catch (error) {
//     console.error("Error updating additional info:", error);
//     toast.error(
//       "Failed to update additional info ❌ " +
//         (error.response?.data?.message || error.message)
//     );
//   }
// };

//   //  Overview Update

//   const [overviewData, setOverviewData] = useState({
//     overviewDescription: "",
//     whatYouWillLearn: "",
//     overviewInstructor: "",
//     videoHours: "",
//     courseLevel: "Beginner",
//     overviewLanguage: "",
//     certificate: false,
//     accessOnMobileAndTV: false,
//   });

//   // ✅ Pre-fill if course.overview exists
//   useEffect(() => {
//     if (course?.overview) {
//       setOverviewData({
//         overviewDescription: course.overview.overviewDescription || "",
//         whatYouWillLearn: course.overview.whatYouWillLearn || "",
//         overviewInstructor: course.overview.overviewInstructor || "",
//         videoHours: course.overview.videoHours || "",
//         courseLevel: course.overview.courseLevel || "Beginner",
//         overviewLanguage: course.overview.overviewLanguage || "",
//         certificate: course.overview.certificate || false,
//         accessOnMobileAndTV: course.overview.accessOnMobileAndTV || false,
//       });
//     }
//   }, [course]);

//   // ✅ Handle form input changes
//   const handleChangeOverview = (e) => {
//     const { name, value, type, checked } = e.target;
//     setOverviewData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // ✅ Submit updated overview
//   const handleSubmitOverview = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.put(
//         `${import.meta.env.VITE_BACKEND_URL}/api/overview/${
//           course.overview?._id
//         }`,
//         overviewData
//       );
//       toast.success("✅ Overview updated successfully!");
//       console.log(res.data);
//     } catch (error) {
//       console.error("❌ Error updating overview:", error);
//       toast.error("Error updating overview");
//     }
//   };

//   // Course Intro Update

//   const [videoData, setVideoData] = useState({
//     title: "",
//     description: "",
//     videoUrl: "",
//   });

//   // ✅ Pre-fill if course has introVideo
//   useEffect(() => {
//     if (course?.introVideo) {
//       setVideoData({
//         title: course.introVideo.title || "",
//         description: course.introVideo.description || "",
//         videoUrl: course.introVideo.videoUrl || "",
//       });
//     }
//   }, [course]);

//   // ✅ Handle input change
//   const handleChangeIntroVideo = (e) => {
//     setVideoData({ ...videoData, [e.target.name]: e.target.value });
//   };

//   // ✅ Submit form (Add or Update based on course.introVideo)
//   const handleSubmitIntroVideo = async (e) => {
//     e.preventDefault();
//     try {
//       // Update existing video
//       const res = await axios.put(
//         `${import.meta.env.VITE_BACKEND_URL}/api/courses/introVideo/${
//           course.introVideo._id
//         }`,
//         videoData
//       );
//       toast.success(res.data.message);
//     } catch (error) {
//       console.error(error);
//       toast.error("Error saving intro video");
//     }
//   };

//   return (
//     <>
//       <div className="fixed inset-0  bg-gray-300  flex justify-center flex-wrap gap-10 items-center  overflow-y-scroll z-50">
//         <div className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-lg space-y-4 relative mt-4">
//           <div className="flex justify-end mt-4 sticky top-4 ">
//             <button type="button" onClick={onClose} className="">
//               ❌
//             </button>
//           </div>
//           <h2 className="text-xl font-bold text-gray-800">📝 Edit Course</h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Title */}
//             <div>
//               <label
//                 htmlFor="title"
//                 className="block mb-1 font-medium text-gray-700"
//               >
//                 Course Title
//               </label>
//               <input
//                 id="title"
//                 type="text"
//                 name="title"
//                 value={form.title}
//                 onChange={handleChange}
//                 placeholder="Title"
//                 className="w-full border p-2 rounded"
//               />
//             </div>

//             {/* Slug */}
//             <div>
//               <label
//                 htmlFor="slug"
//                 className="block mb-1 font-medium text-gray-700"
//               >
//                 Slug
//               </label>
//               <input
//                 id="slug"
//                 type="text"
//                 name="slug"
//                 value={form.slug}
//                 onChange={handleChange}
//                 placeholder="Slug"
//                 className="w-full border p-2 rounded"
//               />
//             </div>

//             {/* Description */}
//             <div>
//               <label
//                 htmlFor="description"
//                 className="block mb-1 font-medium text-gray-700"
//               >
//                 Description
//               </label>
//               <textarea
//                 id="description"
//                 name="description"
//                 value={form.description}
//                 onChange={handleChange}
//                 placeholder="Description"
//                 className="w-full border p-2 rounded"
//               />
//             </div>

//             {/* Regular Price */}
//             <div>
//               <label
//                 htmlFor="regularPrice"
//                 className="block mb-1 font-medium text-gray-700"
//               >
//                 Regular Price
//               </label>
//               <input
//                 id="regularPrice"
//                 type="number"
//                 name="regularPrice"
//                 value={form.regularPrice}
//                 onChange={handleChange}
//                 placeholder="Regular Price"
//                 className="w-full border p-2 rounded"
//               />
//             </div>

//             {/* Discount Price */}
//             <div>
//               <label
//                 htmlFor="discountPrice"
//                 className="block mb-1 font-medium text-gray-700"
//               >
//                 Discount Price
//               </label>
//               <input
//                 id="discountPrice"
//                 type="number"
//                 name="discountPrice"
//                 value={form.discountPrice}
//                 onChange={handleChange}
//                 placeholder="Discount Price"
//                 className="w-full border p-2 rounded"
//               />
//             </div>

//             {/* Categories */}
//             <div>
//               <label
//                 htmlFor="categories"
//                 className="block mb-1 font-medium text-gray-700"
//               >
//                 Categories <span className="text-sm text-gray-500"></span>
//               </label>
//               <select
//                 name="categories"
//                 value={form.categories}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//               >
//                 <option value="Development">Development</option>
//                 <option value="Design">Design</option>
//                 <option value="Marketing">Marketing</option>
//                 <option value="Programming">Programming</option>
//                 <option value="Web Design">Web Design</option>
//               </select>
//             </div>

//             {/* Thumbnail Upload */}
//             <div className="border-2 border-dashed p-6 text-center rounded-md">
//               <label
//                 htmlFor="thumbnail"
//                 className="block mb-2 font-medium text-gray-700"
//               >
//                 Upload Thumbnail
//               </label>
//               <input
//                 id="thumbnail"
//                 type="file"
//                 name="thumbnail"
//                 accept="image/*"
//                 onChange={handleChange}
//                 className="text-sm  border "
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 Recommended size: 700x430px
//               </p>

//               {form.thumbnail && typeof form.thumbnail !== "string" && (
//                 <img
//                   src={URL.createObjectURL(form.thumbnail)}
//                   alt="Preview"
//                   className="mt-4 mx-auto h-40 object-cover rounded shadow-md"
//                 />
//               )}
//               <div className="flex flex-col items-end ">
//                 <p className="text-gray-500 text-xs font-semibold ">
//                   Previous Image{" "}
//                 </p>
//                 <img
//                   src={`${import.meta.env.VITE_BACKEND_URL}${course.thumbnail}`}
//                   alt="whj"
//                   className="w-52"
//                 />
//               </div>
//             </div>

//             {/* Buttons */}
//             <div className="flex justify-between mt-4">
//               <button
//                 type="submit"
//                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//               >
//                 Update Course
//               </button>
//             </div>
//           </form>

//           <h2 className="text-xl font-bold text-gray-800">
//             📝 Edit Additional Information
//           </h2>
//           <form
//             onSubmit={handleSubmitAdditional}
//             className="bg-white space-y-4"
//           >
//             <div>
//               <label className="block font-medium mb-1">Language</label>
//               <input
//                 type="text"
//                 name="language"
//                 value={additionalInfo.language}
//                 onChange={handleChangeAdditional}
//                 className="w-full border p-2 rounded"
//               />
//             </div>

//             <div>
//               <label className="block font-medium mb-1">Start Date</label>
//               <input
//                 type="date"
//                 name="startDate"
//                 value={additionalInfo.startDate}
//                 onChange={handleChangeAdditional}
//                 className="w-full border p-2 rounded"
//               />
//             </div>

//             <div>
//               <label className="block font-medium mb-1">Requirements</label>
//               <input
//                 type="text"
//                 name="requirements"
//                 value={additionalInfo.requirements}
//                 onChange={handleChangeAdditional}
//                 className="w-full border p-2 rounded"
//               />
//             </div>

//             <div>
//               <label className="block font-medium mb-1">Description</label>
//               <textarea
//                 name="description"
//                 value={additionalInfo.description}
//                 onChange={handleChangeAdditional}
//                 className="w-full border p-2 rounded"
//                 rows={4}
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block font-medium mb-1">
//                   Duration (Hours)
//                 </label>
//                 <input
//                   type="number"
//                   name="durationHour"
//                   value={additionalInfo.durationHour}
//                   onChange={handleChangeAdditional}
//                   className="w-full border p-2 rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block font-medium mb-1">
//                   Duration (Minutes)
//                 </label>
//                 <input
//                   type="number"
//                   name="durationMinute"
//                   value={additionalInfo.durationMinute}
//                   onChange={handleChangeAdditional}
//                   className="w-full border p-2 rounded"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block font-medium mb-1">
//                 Tags (comma separated)
//               </label>
//               <input
//                 type="text"
//                 name="tags"
//                 value={additionalInfo.tags}
//                 onChange={handleChangeAdditional}
//                 className="w-full border p-2 rounded"
//                 placeholder="Example: javascript, mern"
//               />
//             </div>

//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             >
//               Update Info
//             </button>
//           </form>

//           <form onSubmit={handleSubmitOverview} className=" space-y-4 mt-8">
//             <h2 className="text-xl font-bold text-gray-700">
//               📘 Update Course Overview
//             </h2>
//             <div>
//               <label className="block font-medium mb-1">
//                 Overview Description
//               </label>
//               <textarea
//                 name="overviewDescription"
//                 value={overviewData.overviewDescription}
//                 onChange={handleChangeOverview}
//                 rows={4}
//                 className="w-full border p-2 rounded"
//               />
//             </div>

//             <div>
//               <label className="block font-medium mb-1">
//                 What You Will Learn
//               </label>
//               <textarea
//                 name="whatYouWillLearn"
//                 value={overviewData.whatYouWillLearn}
//                 onChange={handleChangeOverview}
//                 rows={3}
//                 className="w-full border p-2 rounded"
//               />
//             </div>

//             <div>
//               <label className="block font-medium mb-1">Instructor Name</label>
//               <input
//                 type="text"
//                 name="overviewInstructor"
//                 value={overviewData.overviewInstructor}
//                 onChange={handleChangeOverview}
//                 className="w-full border p-2 rounded"
//               />
//             </div>

//             <div>
//               <label className="block font-medium mb-1">
//                 Total Video Hours
//               </label>
//               <input
//                 type="text"
//                 name="videoHours"
//                 value={overviewData.videoHours}
//                 onChange={handleChangeOverview}
//                 className="w-full border p-2 rounded"
//               />
//             </div>

//             <div>
//               <label className="block font-medium mb-1">Course Level</label>
//               <select
//                 name="courseLevel"
//                 value={overviewData.courseLevel}
//                 onChange={handleChangeOverview}
//                 className="w-full border p-2 rounded-md"
//               >
//                 <option>Beginner</option>
//                 <option>Intermediate</option>
//                 <option>Advanced</option>
//               </select>
//             </div>

//             <div>
//               <label className="block font-medium mb-1">
//                 Overview Language
//               </label>
//               <input
//                 type="text"
//                 name="overviewLanguage"
//                 value={overviewData.overviewLanguage}
//                 onChange={handleChangeOverview}
//                 className="w-full border p-2 rounded"
//               />
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   name="certificate"
//                   checked={overviewData.certificate}
//                   onChange={handleChangeOverview}
//                 />
//                 Certificate Provided
//               </label>

//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   name="accessOnMobileAndTV"
//                   checked={overviewData.accessOnMobileAndTV}
//                   onChange={handleChangeOverview}
//                 />
//                 Access on Mobile & TV
//               </label>
//             </div>

//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             >
//               Update Overview
//             </button>
//           </form>

//           <form onSubmit={handleSubmitIntroVideo} className="space-y-4 mt-8">
//             <h2 className="text-xl font-bold text-gray-700">
//               📹 Upload Course Video URL
//             </h2>

//             <div>
//               <label className="block font-medium mb-1">
//                 Video URL (YouTube, Vimeo, etc.)
//               </label>
//               <input
//                 type="text"
//                 name="videoUrl"
//                 value={videoData.videoUrl}
//                 onChange={handleChangeIntroVideo}
//                 placeholder="https://example.com/video"
//                 className="w-full border p-2 rounded"
//               />
//             </div>

//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             >
//               Upload Video
//             </button>
//           </form>

//           <div className="flex justify-end mt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//       <ToastContainer position="top-right" autoClose={2000} />
//     </>
//   );
// };

// export default EditCourseModal;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditCourseModal = ({ course, onClose }) => {
  const [selectedTab, setSelectedTab] = useState("basic");

  // ------------------- BASIC INFO -------------------
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    regularPrice: "",
    discountPrice: "",
    categories: "",
    thumbnail: "",
    thumbnailPreview: "",
  });

  useEffect(() => {
    if (course) {
      setForm({
        title: course.title || "",
        slug: course.slug || "",
        description: course.description || "",
        regularPrice: course.regularPrice || "",
        discountPrice: course.discountPrice || "",
        categories: Array.isArray(course.categories)
          ? course.categories.join(",")
          : course.categories || "",
        thumbnail: "",
        thumbnailPreview: course.thumbnail || "",
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "thumbnail") {
      const file = files[0];
      setForm((prev) => ({
        ...prev,
        thumbnail: file,
        thumbnailPreview: URL.createObjectURL(file),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitBasic = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "thumbnail" && !value) return;
        if (key !== "thumbnailPreview") formData.append(key, value);
      });

      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/instructor-courses/update/${
          course._id
        }`,
        formData,
        { withCredentials: true }
      );
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  // ------------------- ADDITIONAL INFO -------------------
  const [additionalInfo, setAdditionalInfo] = useState({
    language: "",
    startDate: "",
    requirements: "",
    description: "",
    durationHour: "",
    durationMinute: "",
    tags: "",
  });

  useEffect(() => {
    if (course?.additionalInfo) {
      setAdditionalInfo({
        language: course.additionalInfo.language || "",
        startDate: course.additionalInfo.startDate?.split("T")[0] || "",
        requirements: course.additionalInfo.requirements || "",
        description: course.additionalInfo.description || "",
        durationHour: course.additionalInfo.duration?.hour || "",
        durationMinute: course.additionalInfo.duration?.minute || "",
        tags: Array.isArray(course.additionalInfo.tags)
          ? course.additionalInfo.tags.join(", ")
          : course.additionalInfo.tags || "",
      });
    }
  }, [course]);

  const handleChangeAdditional = (e) => {
    const { name, value } = e.target;
    setAdditionalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitAdditional = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/instructor-courses/${
          course._id
        }/additional-info`,
        {
          ...additionalInfo,
          duration: {
            hour: Number(additionalInfo.durationHour),
            minute: Number(additionalInfo.durationMinute),
          },
          tags: additionalInfo.tags
            ? additionalInfo.tags.split(",").map((t) => t.trim())
            : [],
        },
        { withCredentials: true }
      );
      toast.success("Additional Info updated successfully 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  // ------------------- OVERVIEW -------------------
  const [overviewData, setOverviewData] = useState({
    overviewDescription: "",
    whatYouWillLearn: "",
    overviewInstructor: "",
    videoHours: "",
    courseLevel: "Beginner",
    overviewLanguage: "",
    certificate: false,
    accessOnMobileAndTV: false,
  });

  const [overviewId, setOverviewId] = useState(null);

  // ✅ Load existing overview if available
  useEffect(() => {
    const loadOverview = async () => {
      if (!course?.overview) return;

      const id =
        typeof course.overview === "string"
          ? course.overview
          : course.overview._id;

      setOverviewId(id);

      try {
        // Fetch full overview data from backend
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/overview/${id}`
        );
        const ov = res.data?.overview;
        if (ov) {
          setOverviewData({
            overviewDescription: ov.overviewDescription || "",
            whatYouWillLearn: ov.whatYouWillLearn || "",
            overviewInstructor: ov.overviewInstructor || "",
            videoHours: ov.videoHours || "",
            courseLevel: ov.courseLevel || "Beginner",
            overviewLanguage: ov.overviewLanguage || "",
            certificate: ov.certificate || false,
            accessOnMobileAndTV: ov.accessOnMobileAndTV || false,
          });
        }
      } catch (err) {
        console.error("Error fetching overview", err);
      }
    };

    loadOverview();
  }, [course]);

  // ✅ Handle form input changes
  const handleChangeOverview = (e) => {
    const { name, value, type, checked } = e.target;
    setOverviewData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Create or update overview
  const handleSubmitOverview = async (e) => {
    e.preventDefault();
    try {
      if (overviewId) {
        // 🔁 Update existing overview
        const res = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/overview/${overviewId}`,
          overviewData,
          { withCredentials: true }
        );

        toast.success("Overview updated ✅");
        setOverviewData(res.data.overview);
      } else {
        // ➕ Create new overview and link to course
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/overview/create`,
          { ...overviewData, courseId: course._id },
          { withCredentials: true }
        );

        const newOverview = res.data.overview;
        setOverviewId(newOverview._id);
        setOverviewData(newOverview);

        toast.success("Overview created ✅");
      }
    } catch (err) {
      console.error("Error in overview", err);
      toast.error("Overview save failed");
    }
  };

  // ------------------- INTRO VIDEO -------------------
  const [videoData, setVideoData] = useState({
    videoUrl: "",
  });

  useEffect(() => {
    if (course?.introVideo) {
      setVideoData({
        videoUrl: course.introVideo.videoUrl || "",
      });
    }
  }, [course]);

  const handleChangeIntroVideo = (e) => {
    setVideoData({ ...videoData, [e.target.name]: e.target.value });
  };

  const handleSubmitIntroVideo = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/course-intro-video/introVideo/${course?.introVideo?._id}`,
        videoData
      );

      toast.success(res.data.message);
    } catch (err) {
      toast.error("Error saving intro video");
    }
  };

  // ------------------- JSX -------------------
  return (
    <div className="fixed inset-0 bg-gray-300 flex justify-center items-start overflow-y-auto z-50 p-6">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-lg space-y-4 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">📝 Edit Course</h2>
          <button onClick={onClose}>❌</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {["basic", "additional", "overview", "video"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 text-sm font-semibold ${
                selectedTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              {tab === "basic" && "Basic Info"}
              {tab === "additional" && "Additional Info"}
              {tab === "overview" && "Overview"}
              {tab === "video" && "Intro Video"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {selectedTab === "basic" && (
            <>
              <form onSubmit={handleSubmitBasic} className="space-y-4">
                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="block mb-1 font-medium text-gray-700"
                  >
                    Course Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="w-full border p-2 rounded"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label
                    htmlFor="slug"
                    className="block mb-1 font-medium text-gray-700"
                  >
                    Slug
                  </label>
                  <input
                    id="slug"
                    type="text"
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="Slug"
                    className="w-full border p-2 rounded"
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block mb-1 font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="w-full border p-2 rounded"
                  />
                </div>

                {/* Regular Price */}
                <div>
                  <label
                    htmlFor="regularPrice"
                    className="block mb-1 font-medium text-gray-700"
                  >
                    Regular Price
                  </label>
                  <input
                    id="regularPrice"
                    type="number"
                    name="regularPrice"
                    value={form.regularPrice}
                    onChange={handleChange}
                    placeholder="Regular Price"
                    className="w-full border p-2 rounded"
                  />
                </div>

                {/* Discount Price */}
                <div>
                  <label
                    htmlFor="discountPrice"
                    className="block mb-1 font-medium text-gray-700"
                  >
                    Discount Price
                  </label>
                  <input
                    id="discountPrice"
                    type="number"
                    name="discountPrice"
                    value={form.discountPrice}
                    onChange={handleChange}
                    placeholder="Discount Price"
                    className="w-full border p-2 rounded"
                  />
                </div>

                {/* Categories */}
                <div>
                  <label
                    htmlFor="categories"
                    className="block mb-1 font-medium text-gray-700"
                  >
                    Categories <span className="text-sm text-gray-500"></span>
                  </label>
                  <select
                    name="categories"
                    value={form.categories}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Programming">Programming</option>
                    <option value="Web Design">Web Design</option>
                  </select>
                </div>

                {/* Thumbnail Upload */}
                <div className="border-2 border-dashed p-6 text-center rounded-md">
                  <label
                    htmlFor="thumbnail"
                    className="block mb-2 font-medium text-gray-700"
                  >
                    Upload Thumbnail
                  </label>
                  <input
                    id="thumbnail"
                    type="file"
                    name="thumbnail"
                    accept="image/*"
                    onChange={handleChange}
                    className="text-sm  border "
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended size: 700x430px
                  </p>

                  {form.thumbnail && typeof form.thumbnail !== "string" && (
                    <img
                      src={URL.createObjectURL(form.thumbnail)}
                      alt="Preview"
                      className="mt-4 mx-auto h-40 object-cover rounded shadow-md"
                    />
                  )}
                  <div className="flex flex-col items-end ">
                    <p className="text-gray-500 text-xs font-semibold ">
                      Previous Image{" "}
                    </p>
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}${
                        course.thumbnail
                      }`}
                      alt="whj"
                      className="w-52"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Update Course
                  </button>
                </div>
              </form>
            </>
          )}

          {selectedTab === "additional" && (
            <form
              onSubmit={handleSubmitAdditional}
              className="bg-white space-y-4"
            >
              <div>
                <label className="block font-medium mb-1">Language</label>
                <input
                  type="text"
                  name="language"
                  value={additionalInfo.language}
                  onChange={handleChangeAdditional}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={additionalInfo.startDate}
                  onChange={handleChangeAdditional}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Requirements</label>
                <input
                  type="text"
                  name="requirements"
                  value={additionalInfo.requirements}
                  onChange={handleChangeAdditional}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={additionalInfo.description}
                  onChange={handleChangeAdditional}
                  className="w-full border p-2 rounded"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">
                    Duration (Hours)
                  </label>
                  <input
                    type="number"
                    name="durationHour"
                    value={additionalInfo.durationHour}
                    onChange={handleChangeAdditional}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    name="durationMinute"
                    value={additionalInfo.durationMinute}
                    onChange={handleChangeAdditional}
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={additionalInfo.tags}
                  onChange={handleChangeAdditional}
                  className="w-full border p-2 rounded"
                  placeholder="Example: javascript, mern"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Update Info
              </button>
            </form>
          )}

          {selectedTab === "overview" && (
            <form onSubmit={handleSubmitOverview} className=" space-y-4 mt-8">
              <h2 className="text-xl font-bold text-gray-700">
                📘 Update Course Overview
              </h2>
              <div>
                <label className="block font-medium mb-1">
                  Overview Description
                </label>
                <textarea
                  name="overviewDescription"
                  value={overviewData.overviewDescription}
                  onChange={handleChangeOverview}
                  rows={4}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">
                  What You Will Learn
                </label>
                <textarea
                  name="whatYouWillLearn"
                  value={overviewData.whatYouWillLearn}
                  onChange={handleChangeOverview}
                  rows={3}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Instructor Name
                </label>
                <input
                  type="text"
                  name="overviewInstructor"
                  value={overviewData.overviewInstructor}
                  onChange={handleChangeOverview}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Total Video Hours
                </label>
                <input
                  type="text"
                  name="videoHours"
                  value={overviewData.videoHours}
                  onChange={handleChangeOverview}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Course Level</label>
                <select
                  name="courseLevel"
                  value={overviewData.courseLevel}
                  onChange={handleChangeOverview}
                  className="w-full border p-2 rounded-md"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Overview Language
                </label>
                <input
                  type="text"
                  name="overviewLanguage"
                  value={overviewData.overviewLanguage}
                  onChange={handleChangeOverview}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="certificate"
                    checked={overviewData.certificate}
                    onChange={handleChangeOverview}
                  />
                  Certificate Provided
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="accessOnMobileAndTV"
                    checked={overviewData.accessOnMobileAndTV}
                    onChange={handleChangeOverview}
                  />
                  Access on Mobile & TV
                </label>
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Update Overview
              </button>
            </form>
          )}

          {selectedTab === "video" && (
            <form onSubmit={handleSubmitIntroVideo} className="space-y-4">
              <input
                name="videoUrl"
                value={videoData.videoUrl}
                onChange={handleChangeIntroVideo}
                className="w-full border p-2 rounded"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Save Video
              </button>
            </form>
          )}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default EditCourseModal;
