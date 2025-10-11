// import { FaHeart, FaRegClock, FaRegStar } from "react-icons/fa";
// import { MdCurrencyRupee } from "react-icons/md";
// import { TiDocumentText } from "react-icons/ti";
// import { Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import { useStudentAuth } from "../studentDashboard/StudentesPages/studentAuth";
// import { useCartContext } from "../context/CartContext";
// import { HiOutlineClock } from "react-icons/hi";

// function WishlistItems() {
//   //  const {wishlistItems, fetchWishlist} = useStudentAuth();
//   const [deletingId, setDeletingId] = useState(null);
//   const [error, setError] = useState(null);
//   const { fetchWishlist, wishlistItems } = useCartContext();

//   // Fetch wishlist items for logged-in user

//   // Delete item from wishlist
//   const deleteWishlistItems = async (id) => {
//     try {
//       setDeletingId(id);
//       await axios.delete(
//         `${import.meta.env.VITE_BACKEND_URL}/api/wishlist/${id}`,
//         {
//           withCredentials: true,
//         }
//       );
//       fetchWishlist();
//       toast.success("Removed from wishlist");
//       setDeletingId(null);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to remove item");
//       setDeletingId(null);
//     }
//   };

//   if (error) {
//     return (
//       <p className="text-center text-[18px] text-red-500 py-10">{error}</p>
//     );
//   }

//   if (!wishlistItems || wishlistItems.length === 0) {
//     return (
//       <p className="text-center text-[18px] text-gray-500 py-10">
//         Your wishlist is empty.
//       </p>
//     );
//   }

//   return (
//     <div className="pb-[30px] px-4 sm:px-10 md:px-24 font-[Manrope] max-w-screen-2xl mx-auto">
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {console.log("wiahlist", wishlistItems)}
//         {wishlistItems.map((course, index) => {
//           const averageRating =
//             course.course.reviews && course.course.reviews.length > 0
//               ? (
//                   course.course.reviews.reduce(
//                     (sum, review) => sum + review.rating,
//                     0
//                   ) / course.course.reviews.length
//                 ).toFixed(1)
//               : null;
//           return (
//             <div
//               key={course._id || index}
//               className="max-w-[400px] max-h-[499px] border-1 rounded-[12px] p-4 border-[#E3E3E3] hover:border-[#296AD2] flex flex-col justify-center gap-4"
//             >
//               {/* Course Thumbnail */}
//               <div className="relative w-full">
//                 <img
//                   src={`${import.meta.env.VITE_BACKEND_URL}${
//                     course.course?.thumbnail || ""
//                   }`}
//                   alt={course.course?.title || "Course"}
//                   onError={(e) => (e.target.src = "/fallback.jpg")}
//                   className="rounded-[12px] w-full h-[200px] object-cover"
//                 />

//                 <div className="absolute top-3 left-3">
//                   <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm">
//                     <HiOutlineClock className="w-3 h-3" />
//                     {course.course.additionalInfo?.duration
//                       ? `${course.course.additionalInfo.duration.hour}h ${course.course.additionalInfo.duration.minute}m`
//                       : "N/A"}
//                   </span>
//                 </div>
//                 <button
//                   onClick={() => deleteWishlistItems(course._id)}
//                   disabled={deletingId === course._id}
//                   className="cursor-pointer absolute top-2 right-4 bg-[#ffffff] rounded-full p-2 disabled:opacity-50"
//                 >
//                   <FaHeart className="text-red-600" />
//                 </button>
//               </div>

//               {/* Course Info */}
//               <div className="font-[Manrope] pb-2">
//                 <h3 className="pb-3 font-semibold text-[20px] text-[#292929]">
//                   {course.course?.title || "N/A"}
//                 </h3>
//                 <p className="pb-3 font-normal text-[16px] text-[#6F6F6F]">
//                   {course.course?.description.slice(0, 50) || "N/A"}
//                 </p>
//                 <div className="flex justify-between">
//                   <div className="flex items-center gap-1">
//                     <TiDocumentText />
//                     <p className="font-semibold text-[16px] text-[#292929]">
//                       {course.course?.modules?.reduce(
//                         (sum, module) => sum + (module.lessons?.length || 0),
//                         0
//                       ) || 0}{" "}
//                       Lessons
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <FaRegStar className="text-[#F04438E5]" />
//                     <p className="font-semibold text-[16px]">
//                       {averageRating || "New"}{" "}
//                       <span className="text-gray-500">
//                         ({course.course?.reviews.length})
//                       </span>
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Price and Enroll */}
//               <div className="flex justify-between items-center font-[Manrope]">
//                 <div className="flex items-center">
//                   <MdCurrencyRupee className="text-[#F04438] text-[20px]" />
//                   <p className="font-semibold text-[20px] text-[#F04438]">
//                     {course.course?.discountPrice ||
//                       course.course?.regularPrice ||
//                       0}
//                   </p>
//                 </div>
//                 <Link
//                   to={`/courseDetailsOverview/${course.course?._id}`}
//                   state={course.course}
//                 >
//                   <button className="cursor-pointer py-3 px-6 border-1 hover:bg-[#296AD2] hover:text-white border-[#296AD2] text-[#296AD2] font-medium text-[16px] rounded-[4px]">
//                     Enroll Now
//                   </button>
//                 </Link>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//       <ToastContainer autoClose={1000} />
//     </div>
//   );
// }

// export default WishlistItems;


import React, { useState } from "react";
import { FaHeart, FaRegStar } from "react-icons/fa";
import { MdCurrencyRupee } from "react-icons/md";
import { TiDocumentText } from "react-icons/ti";
import { Link } from "react-router-dom";
import { HiOutlineClock } from "react-icons/hi";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCartContext } from "../context/CartContext";

function WishlistItems() {
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);
  const { fetchWishlist, wishlistItems } = useCartContext();

  const deleteWishlistItems = async (id) => {
    try {
      setDeletingId(id);
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/wishlist/${id}`, {
        withCredentials: true,
      });
      await fetchWishlist();
      toast.success("Removed from wishlist");
      setDeletingId(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item");
      setDeletingId(null);
    }
  };

  if (error) {
    return <p className="text-center text-lg text-red-500 py-10">{error}</p>;
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex flex-col items-center gap-4">
          <div className="bg-blue-50 rounded-full p-4 shadow-sm">
            <FaHeart className="text-blue-600 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Your wishlist is empty</h2>
          <p className="text-gray-500 max-w-md">
            Save courses you like and they’ll appear here for quick access later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12 px-4 sm:px-8 md:px-16 lg:px-24 max-w-screen-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Wishlist</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {console.log("wishlist" , wishlistItems)}
        {wishlistItems.map((item, idx) => {
          const course = item.course || {};
          const averageRating =
            course.reviews && course.reviews.length > 0
              ? (
                  course.reviews.reduce((sum, r) => sum + r.rating, 0) /
                  course.reviews.length
                ).toFixed(1)
              : null;

          const totalLessons =
            course.modules?.reduce(
              (sum, module) => sum + (module.lessons?.length || 0),
              0
            ) || 0;

          return (
            <article
              key={item._id || idx}
              className="bg-white rounded-2xl  duration-200 border border-gray-400 overflow-hidden flex flex-col justify-between "
            >
              {/* thumbnail */}
              <div className="relative">
                <Link to={`/courseDetailsOverview/${course._id}`} state={course}>
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}${course?.thumbnail || ""}`}
                    alt={course?.title || "Course thumbnail"}
                    // onError={(e) => (e.target.src = "/fallback.jpg")}
                    className="w-full h-44 object-cover"
                  />
                </Link>

                {/* top-left duration pill */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                    <HiOutlineClock className="w-3 h-3" />
                    {course.additionalInfo?.duration
                      ? `${course.additionalInfo.duration.hour}h ${course.additionalInfo.duration.minute}m`
                      : "N/A"}
                  </span>
                </div>

                {/* top-right remove button */}
                <button
                  onClick={() => deleteWishlistItems(item._id)}
                  disabled={deletingId === item._id}
                  aria-label="Remove from wishlist"
                  className="absolute top-3 right-3 bg-white/95 rounded-full p-2 shadow-sm hover:scale-105 transform transition-transform disabled:opacity-60"
                >
                  {deletingId === item._id ? (
                    <svg
                      className="w-4 h-4 animate-spin text-red-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                  ) : (
                    <FaHeart className="text-red-600 w-4 h-4" />
                  )}
                </button>
              </div>

              {/* body */}
              <div className="p-4 flex-1 flex flex-col">
                <Link to={`/courseDetailsOverview/${course._id}`} state={course} className="group">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {course.title || "Untitled Course"}
                  </h3>
                </Link>

                <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                  {course.description || "No description available."}
                </p>

                
                  {/* meta pills */}
                  <div className=" mt-4 flex items-center justify-between gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full text-xs text-gray-600 border border-gray-100">
                      <TiDocumentText className="w-4 h-4" />
                      <span className="font-medium text-sm">{totalLessons} Lessons</span>
                    </span>

                    <span className="inline-flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full text-xs text-gray-600 border border-gray-100">
                      <FaRegStar className="w-3 h-3 text-amber-400" />
                      <span className="font-medium text-sm">{averageRating || "New"}</span>
                      {course.reviews?.length ? (
                        <span className="text-xs text-gray-400">({course.reviews.length})</span>
                      ) : null}
                    </span>
                  

                
                  
                </div>

                <div className="mt-4 pt-3 border-t border-gray-300 flex  gap-3">
                  <Link to={`/courseDetailsOverview/${course._id}`} state={course} className="flex-1">
                    <button className="w-full py-2 px-3 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                      View Program
                    </button>
                  </Link>
                  
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <ToastContainer autoClose={1000} />
    </div>
  );
}

export default WishlistItems;
