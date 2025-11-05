import React, { useState } from "react";
import { FaHeart, FaStar, FaBook, FaClock } from "react-icons/fa";
import img from "../../assets/image/img1.png";
import { useStudentAuth } from "./studentAuth";
import { FaRegClock, FaRegStar } from "react-icons/fa6";
import { TiDocumentText } from "react-icons/ti";
import { MdCurrencyRupee } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { HiOutlineClock } from "react-icons/hi";
import { useCartContext } from "../../context/CartContext";

const StuWishlist = () => {
  
  // const { wishlistItems, fetchWishlist } = useStudentAuth();
  const { cartItems , wishlistItems , fetchCartItems, fetchWishlist } = useCartContext();
  // console.log("wishlistitems" , wishlistItems)

  const [deletingId, setDeletingId] = useState(null);

  const deleteWishlistItems = async (id) => {
    try {
      setDeletingId(id);
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/wishlist/${id}`, {
        withCredentials: true,
      });
      fetchWishlist();
      setDeletingId(null);
      toast.success("Removed from wishlist");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item");
      setDeletingId(null);
    }
  };

  if (wishlistItems.length === 0) {
  return (
    <div className="text-center text-gray-600 py-6">
      <p className="text-lg font-medium">Your wishlist is empty</p>
      <p className="text-sm text-gray-500">Start adding your favorite courses here ✨</p>
    </div>
  );
}


  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Wishlist</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
  {wishlistItems.map((item, index) => {
    const course = item.course || {};
    const totalLessons =
      (course.modules || []).reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;

    return (
      <div
        key={item._id || index}
        className="group bg-white rounded-xl border border-gray-200 hover:shadow-xl hover:border-gray-300 transition-all duration-300 overflow-hidden flex flex-col h-full"
      >
        {/* Thumbnail */}
        <div className="relative overflow-hidden">
          <Link to={`/dashboard/stuAllCourse/${course._id}`} state={course}>
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}${course.thumbnail || ""}`}
              alt={course.title || "Course"}
              // onError={(e) => { e.currentTarget.src = "/fallback.jpg"; }}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Duration badge (matches reference style) */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm">
              <HiOutlineClock className="w-3 h-3" />
              {course.additionalInfo?.duration
                ? `${course.additionalInfo.duration.hour}h ${course.additionalInfo.duration.minute}m`
                : "N/A"}
            </span>
          </div>

          {/* Wishlist remove (filled heart) */}
          <button
            onClick={() => deleteWishlistItems(item._id)}
            disabled={deletingId === item._id}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm transition-all duration-200 hover:bg-white hover:scale-110 disabled:opacity-60"
            aria-label="Remove from wishlist"
            title="Remove from wishlist"
          >
            {deletingId === item._id ? (
              // Simple spinner
              <svg className="animate-spin h-4 w-4 text-red-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            ) : (
              <FaHeart className="w-4 h-4 text-red-500" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-3 flex-1 flex flex-col">
          <Link to={`/dashboard/stuAllCourse/${course._id}`} state={course}>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-1">
              {course.title || "Untitled course"}
            </h3>
          </Link>

          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-2">
            {course.description || "No description available."}
          </p>

          <div className="flex items-center justify-between mb-2 text-sm">
            <div className="flex items-center gap-1 text-gray-500">
              <TiDocumentText className="w-4 h-4" />
              <span>{totalLessons} Lessons</span>
            </div>

            <div className="flex items-center gap-1">
              <FaRegStar className="w-4 h-4 text-amber-400" />
              <span className="text-gray-700 font-medium">{course.rating ?? "New"}</span>
            </div>
          </div>

          {/* Footer pinned */}
          <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold text-gray-900">
                ₹{course.discountPrice ?? course.regularPrice ?? 0}
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
  );
};

export default StuWishlist;
