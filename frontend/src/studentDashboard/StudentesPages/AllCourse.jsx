// import React from "react";
// import Card from "../../componant/Card.jsx";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { FaBook, FaHeart, FaRegClock, FaRegHeart } from "react-icons/fa";
// import { FaRegStar } from "react-icons/fa";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useState } from "react";
// import { useEffect } from "react";
// import { HiOutlineClock } from "react-icons/hi";
// import { useStudentAuth } from "./studentAuth.js";

// export const AllCourse = () => {
//   const [all_course, setAll_course] = useState([]);
//   const [wishlist, setWishlist] = useState([]); // ✅ added
//   const { wishlistItems, fetchWishlist } = useStudentAuth();

//   const categoriesButton = [
//     "All Categories",
//     "Development",
//     "Design",
//     "Marketing",
//     "Programming",
//     "Web Design",
//   ];

//   const [activeCategory, setActiveCategory] = useState("All Categories");

//   const addToWishlist = async (course) => {
//     try {
//       await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/wishlist/add`,
//         { courseId: course._id },
//         { withCredentials: true }
//       );
//       toast.success("Added to wishlist");

//       // ✅ Update local state so it turns red immediately
//       setWishlist((prev) => [...prev, course._id]);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to add to wishlist");
//     }
//   };

//   useEffect(() => {
//     const fetchAllCourses = async () => {
//       try {
//         const res = await axios.get(
//           `${import.meta.env.VITE_BACKEND_URL}/api/instructor-courses`
//           // `${import.meta.env.VITE_BACKEND_URL}/api/courses/all/full`
//         );

//         // ✅ Only include published courses
//         const publishedCourses = (res.data.courses || []).filter(
//           (course) => course.status === "Published"
//         );

//         setAll_course(publishedCourses);
//         console.log( "pupublishedCourses",publishedCourses)
//         fetchWishlist();
//       } catch (err) {
//         console.error("Error fetching courses", err);
//       }
//     };

//     fetchAllCourses();
//   }, []);

//   const filteredCourses =
//     activeCategory === "All Categories"
//       ? all_course
//       : all_course.filter((course) => course.categories === activeCategory);

//   useEffect(() => {
//     if (wishlistItems?.length > 0) {
//       const ids = wishlistItems.map((item) => item.course._id);
//       setWishlist(ids);
//     }
//   }, [wishlistItems]);

//   return (
//     <>
//       <div className="p-6">
//         <h1 className="text-3xl font-bold text-gray-900">All Courses</h1>
//         <div className="  max-w-screen-2xl mx-auto ">
//           <div className="flex gap-4 flex-wrap justify-center mb-6">
//             {categoriesButton.map((category) => (
//               <button
//                 key={category}
//                 onClick={() => setActiveCategory(category)}
//                 className={`px-6 py-2 rounded-[40px] border text-sm transition duration-300 cursor-pointer font-medium
//                   ${
//                     activeCategory === category
//                       ? "bg-blue-600 text-white"
//                       : "bg-white text-blue-600 border-blue-500 hover:bg-blue-100"
//                   }`}
//               >
//                 {category}
//               </button>
//             ))}
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3">
//             {filteredCourses.map((course, index) => {
//               const averageRating =
//                 course.reviews && course.reviews.length > 0
//                   ? (
//                       course.reviews.reduce(
//                         (sum, review) => sum + review.rating,
//                         0
//                       ) / course.reviews.length
//                     ).toFixed(1)
//                   : null;

//               const totalLessons =
//                 course.modules?.reduce(
//                   (sum, module) => sum + (module.lessons?.length || 0),
//                   0
//                 ) || 0;

//               return (
//                 <div
//                   key={course.id || index}
//                   className="group bg-white rounded-xl border-b border-gray-400 hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden"
//                 >
                  
//                   <div className="relative overflow-hidden">
//                     <Link
//                       to={`/dashboard/stuAllCourse/${course._id}`}
//                       state={course}
//                     >
//                       <img
//                         src={`${import.meta.env.VITE_BACKEND_URL}${
//                           course.thumbnail
//                         }`}
//                         alt={course.title}
//                         className="w-full h-48 object-cover group-hover:scale-105 transition-transform  duration-300"
//                       />
//                     </Link>

                  
//                     <div className="absolute top-3 left-3">
//                       <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm">
//                         <HiOutlineClock className="w-3 h-3" />
//                         {course.additionalInfo?.duration
//                           ? `${course.additionalInfo.duration.hour}h ${course.additionalInfo.duration.minute}m`
//                           : "N/A"}
//                       </span>
//                     </div>

                   
//                     <button
//                       onClick={() => addToWishlist(course)}
//                       className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2 shadow-sm transition-all duration-200 hover:scale-110"
//                     >
//                       {wishlist.includes(course._id) ? (
//                         <FaHeart className="w-4 h-4 text-red-500" />
//                       ) : (
//                         <FaRegHeart className="w-4 h-4 text-gray-600 hover:text-red-500" />
//                       )}
//                     </button>
//                   </div>

                  
//                   <div className="px-5 py-2 ">
                    
//                     <Link
//                       to={`/dashboard/stuAllCourse/${course._id}`}
//                       state={course}
//                     >
//                       <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-1">
//                         {course.title}
//                       </h3>
//                     </Link>

                   
//                     <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-2">
//                       {course.description}
//                     </p>

                    
//                     <div className="flex items-center justify-between mb-2 text-sm">
//                       <div className="flex items-center gap-1 text-gray-500">
//                         <FaBook className="w-3 h-3" />
//                         <span>{totalLessons} Lessons</span>
//                       </div>

//                       <div className="flex items-center gap-1">
//                         <FaRegStar className="w-3 h-3 text-amber-400" />
//                         <span className="text-gray-700 font-medium">
//                           {averageRating || "New"}
//                         </span>
//                         {course.reviews && course.reviews.length > 0 && (
//                           <span className="text-gray-400 ml-1">
//                             ({course.reviews.length})
//                           </span>
//                         )}
//                       </div>
//                     </div>

                    
//                     <div className="flex items-center justify-between pt-2 border-t border-gray-100">
//                       <div className="flex items-center gap-2">
//                         <span className="text-xl font-bold text-gray-900">
//                           ₹{course.discountPrice}
//                         </span>
                        
//                       </div>

//                       <Link
//                         to={`/dashboard/stuAllCourse/${course._id}`}
//                         state={course}
//                         className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
//                       >
//                         View Details
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//           <ToastContainer autoClose={1000} />
//         </div>
//       </div>
      
       
//     </>
//   );
// };

import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaBook, FaHeart, FaRegHeart, FaRegStar } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { HiOutlineClock } from "react-icons/hi";
import { useStudentAuth } from "./studentAuth.js";

export const AllCourse = () => {
  const [all_course, setAll_course] = useState([]);
  const [wishlist, setWishlist] = useState([]); // ✅ added
  const { wishlistItems, fetchWishlist } = useStudentAuth();

  const categoriesButton = [
    "All Categories",
    "Development",
    "Design",
    "Marketing",
    "Programming",
    "Web Design",
  ];

  const [activeCategory, setActiveCategory] = useState("All Categories");

  const addToWishlist = async (course) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/wishlist/add`,
        { courseId: course._id },
        { withCredentials: true }
      );
      toast.success("Added to wishlist");

      // ✅ Update local state so it turns red immediately
      setWishlist((prev) => [...prev, course._id]);
      // ensure global wishlist is fresh
      fetchWishlist();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to wishlist");
    }
  };

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/instructor-courses`
        );

        // ✅ Only include published courses
        const publishedCourses = (res.data.courses || []).filter(
          (course) => course.status === "Published"
        );

        setAll_course(publishedCourses);
        fetchWishlist();
      } catch (err) {
        console.error("Error fetching courses", err);
      }
    };

    fetchAllCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredCourses =
    activeCategory === "All Categories"
      ? all_course
      : all_course.filter((course) => course.categories === activeCategory);

  useEffect(() => {
    if (wishlistItems?.length > 0) {
      const ids = wishlistItems.map((item) => item.course._id);
      setWishlist(ids);
    } else {
      setWishlist([]);
    }
  }, [wishlistItems]);

  return (
    <>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900">All Courses</h1>
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex gap-4 flex-wrap justify-center mb-6">
            {categoriesButton.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-[40px] border text-sm transition duration-300 cursor-pointer font-medium
                  ${
                    activeCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-white text-blue-600 border-blue-500 hover:bg-blue-100"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* items-stretch makes all cards equal height so footer lines up */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 items-stretch">
            {filteredCourses.map((course, index) => {
              const averageRating =
                course.reviews && course.reviews.length > 0
                  ? (
                      course.reviews.reduce(
                        (sum, review) => sum + review.rating,
                        0
                      ) / course.reviews.length
                    ).toFixed(1)
                  : null;

              const totalLessons =
                course.modules?.reduce(
                  (sum, module) => sum + (module.lessons?.length || 0),
                  0
                ) || 0;

              const isWished = wishlist.includes(course._id);

              return (
                // make card a full-height column so footer can stick to bottom
                <div
                  key={course.id || index}
                  className="group bg-white rounded-xl border-b border-gray-400 hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden flex flex-col h-full"
                >
                  <div className="relative overflow-hidden">
                    <Link
                      to={`/dashboard/stuAllCourse/${course._id}`}
                      state={course}
                    >
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}${course.thumbnail}`}
                        alt={course.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm">
                        <HiOutlineClock className="w-3 h-3" />
                        {course.additionalInfo?.duration
                          ? `${course.additionalInfo.duration.hour}h ${course.additionalInfo.duration.minute}m`
                          : "N/A"}
                      </span>
                    </div>

                    <button
                      onClick={() => addToWishlist(course)}
                      className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2 shadow-sm transition-all duration-200 hover:scale-110"
                      aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      {isWished ? (
                        <FaHeart className="w-4 h-4 text-red-500" />
                      ) : (
                        <FaRegHeart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                      )}
                    </button>
                  </div>

                  {/* content area grows so footer is pinned */}
                  <div className="px-5 py-2 flex-1 flex flex-col">
                    <Link
                      to={`/dashboard/stuAllCourse/${course._id}`}
                      state={course}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-1">
                        {course.title}
                      </h3>
                    </Link>

                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-2">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between mb-2 text-sm">
                      <div className="flex items-center gap-1 text-gray-500">
                        <FaBook className="w-3 h-3" />
                        <span>{totalLessons} Lessons</span>
                      </div>

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

                    {/* Footer pinned to bottom */}
                    <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-900">
                          ₹{course.discountPrice}
                        </span>
                      </div>

                      <Link
                        to={`/dashboard/stuAllCourse/${course._id}`}
                        state={course}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <ToastContainer autoClose={1000} />
        </div>
      </div>
    </>
  );
};
