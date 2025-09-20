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

const StuWishlist = () => {
  
  const { wishlistItems, fetchWishlist } = useStudentAuth();
  // console.log("wishlistitems" , wishlistItems)

  const [deletingId, setDeletingId] = useState(null);

  const deleteWishlistItems = async (id) => {
    try {
      setDeletingId(id);
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/wishlist/${id}`, {
        withCredentials: true,
      });
      toast.success("Removed from wishlist");
      fetchWishlist();
      setDeletingId(null);
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {wishlistItems.map((course, index) => (
          <div
            key={course._id || index}
            className="max-w-[400px] max-h-[499px] border-1 rounded-[12px] p-4 border-[#E3E3E3] hover:border-[#296AD2] flex flex-col gap-4"
          >
            {/* Course Thumbnail */}
            <div className="relative w-full">
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}${course.course?.thumbnail || ""}`}
                alt={course.course?.title || "Course"}
                onError={(e) => (e.target.src = "/fallback.jpg")}
                className="rounded-[12px] w-full h-[200px] object-cover"
              />
              <div className="absolute top-2 left-4 bg-[#296AD2] py-2 px-[21px] rounded-[40px] flex gap-2 items-center">
                <FaRegClock className="text-white" />
                <p className="text-[14px] font-normal text-white">
                  {course.course?.additionalInfo?.duration
                    ? `${course.course.additionalInfo.duration.hour}h ${course.course.additionalInfo.duration.minute}m`
                    : "N/A"}
                </p>
              </div>
              <button
                onClick={() => deleteWishlistItems(course._id)}
                disabled={deletingId === course._id}
                className="cursor-pointer absolute top-2 right-4 bg-[#ffffff] rounded-full p-2 disabled:opacity-50"
              >
                <FaHeart className="text-red-600" />
              </button>
            </div>

            {/* Course Info */}
            <div className="font-[Manrope] pb-2">
              <h3 className="pb-3 font-semibold text-[20px] text-[#292929]">
                {course.course?.title || "N/A"}
              </h3>
              <p className="pb-3 font-normal text-[16px] text-[#6F6F6F]">
                {course.course?.description || "N/A"}
              </p>
              <div className="flex justify-between">
                <div className="flex items-center gap-1">
                  <TiDocumentText />
                  <p className="font-semibold text-[16px] text-[#292929]">
                    {course.course?.modules?.reduce(
                      (sum, module) => sum + (module.lessons?.length || 0),
                      0
                    ) || 0}{" "}
                    Lessons
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <FaRegStar className="text-[#F04438E5]" />
                  <p className="font-semibold text-[16px]">
                    {course.course?.rating || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Price and Enroll */}
            <div className="flex justify-between items-center font-[Manrope]">
              <div className="flex items-center">
                <MdCurrencyRupee className="text-[#F04438] text-[20px]" />
                <p className="font-semibold text-[20px] text-[#F04438]">
                  {course.course?.discountPrice ||
                    course.course?.regularPrice ||
                    0}
                </p>
              </div>
              <Link
                to={`/courseDetailsOverview/${course.course?._id}`}
                state={course.course}
              >
                <button className="cursor-pointer py-3 px-6 border-1 hover:bg-[#296AD2] hover:text-white border-[#296AD2] text-[#296AD2] font-medium text-[16px] rounded-[4px]">
                  Enroll Now
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default StuWishlist;
