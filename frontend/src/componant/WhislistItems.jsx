import { FaHeart, FaRegClock, FaRegStar } from "react-icons/fa";
import { MdCurrencyRupee } from "react-icons/md";
import { TiDocumentText } from "react-icons/ti";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useStudentAuth } from "../studentDashboard/StudentesPages/studentAuth";
import { useCartContext } from "../context/CartContext";

function WishlistItems() {
//  const {wishlistItems, fetchWishlist} = useStudentAuth();
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);
  const {fetchWishlist, wishlistItems} = useCartContext()

  // Fetch wishlist items for logged-in user
  

  // Delete item from wishlist
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

  

  if (error) {
    return (
      <p className="text-center text-[18px] text-red-500 py-10">{error}</p>
    );
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <p className="text-center text-[18px] text-gray-500 py-10">
        Your wishlist is empty.
      </p>
    );
  }

  return (
    <div className="pb-[30px] px-4 sm:px-10 md:px-24 font-[Manrope] max-w-screen-2xl mx-auto">
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
                  {course.course?.discountPrice || course.course?.regularPrice || 0}
                </p>
              </div>
              <Link to={`/courseDetailsOverview/${course.course?._id}`} state={course.course}>
                <button className="cursor-pointer py-3 px-6 border-1 hover:bg-[#296AD2] hover:text-white border-[#296AD2] text-[#296AD2] font-medium text-[16px] rounded-[4px]">
                  Enroll Now
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer autoClose={1000}/>
    </div>
  );
}

export default WishlistItems;
