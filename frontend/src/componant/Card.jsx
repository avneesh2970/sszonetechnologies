
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaBook, FaHeart, FaRegHeart } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiOutlineClock } from "react-icons/hi";
import { useCartContext } from "../context/CartContext";

const CourseList = ({}) => {
  const [all_course, setAll_course] = useState([]);
  // list of course ids currently in wishlist
  const [wishlistIds, setWishlistIds] = useState([]);
  // map courseId -> wishlistItemId (so we can delete by wishlist id)
  const [wishlistMap, setWishlistMap] = useState({});

  const { fetchWishlist, wishlistItems } = useCartContext();

  const categoriesButton = [
    "All Categories",
    "Development",
    "Design",
    "Marketing",
    "Programming",
    "Web Design",
  ];

  const [activeCategory, setActiveCategory] = useState("All Categories");

  const toggleWishlist = async (course) => {
    const courseId = course._id;
    const isInWishlist = wishlistIds.includes(courseId);

    if (isInWishlist) {
      const wishlistItemId = wishlistMap[courseId];
      if (!wishlistItemId) {
        toast.error("Could not find wishlist item. Refreshing...");
        await fetchWishlist();
        return;
      }

      // ✅ Optimistic local update
      setWishlistIds((prev) => prev.filter((id) => id !== courseId));
      setWishlistMap((prev) => {
        const copy = { ...prev };
        delete copy[courseId];
        return copy;
      });

      try {
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/wishlist/${wishlistItemId}`,
          { withCredentials: true }
        );
        

        // ✅ Immediately refresh global wishlist (for count update)
        await fetchWishlist();
        toast.success("Removed from wishlist");
      } catch (err) {
        console.error(err);
        toast.error("Failed to remove from wishlist");
        // rollback optimistic update
        setWishlistIds((prev) => [...prev, courseId]);
        await fetchWishlist();
      }
    } else {
      // ✅ Optimistic local add
      setWishlistIds((prev) => [...prev, courseId]);

      try {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/wishlist/add`,
          { courseId },
          { withCredentials: true }
        );
        
        // ✅ Immediately refresh global wishlist (for count update)
        await fetchWishlist();
        toast.success("Added to wishlist");
      } catch (err) {
        console.error(err);
        toast.error("Failed to add to wishlist");
        // rollback optimistic add
        setWishlistIds((prev) => prev.filter((id) => id !== courseId));
        await fetchWishlist();
      }
    }
  };

  // fetch all course and then filter them
  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/instructor-courses`
        );

        const publishedCourses = (res.data.courses || []).filter(
          (course) => course.status === "Published"
        );

        setAll_course(publishedCourses);
        // ensure we have wishlist info from server
        fetchWishlist();
      } catch (err) {
        console.error("Error fetching courses", err);
      }
    };

    fetchAllCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Whenever wishlistItems from context updates, update local wishlist IDs and map
  useEffect(() => {
    if (wishlistItems?.length > 0) {
      // wishlistItems shape assumed: [{ _id: 'wishlistItemId', course: { _id, ... } }, ...]
      const ids = [];
      const map = {};
      wishlistItems.forEach((item) => {
        const courseObj = item.course || item.courseId || item.course_details;
        const courseId = courseObj?._id || courseObj?.id || item.courseId;
        const wishlistItemId = item._id || item.id || item.wishlistId;
        if (courseId) {
          ids.push(courseId);
          if (wishlistItemId) map[courseId] = wishlistItemId;
        }
      });
      setWishlistIds(ids);
      setWishlistMap(map);
    } else {
      // if empty, clear local states
      setWishlistIds([]);
      setWishlistMap({});
    }
  }, [wishlistItems]);

  const filteredCourses =
    activeCategory === "All Categories"
      ? all_course
      : all_course.filter((course) => course.categories === activeCategory);

  return (
    <>
      {/* <div className="max-w-screen-2xl mx-auto ">
        <div className="px-4 sm:px-10 lg:px-20   ">
          <div className="flex gap-2 md:justify-center overflow-x-auto  whitespace-nowrap scroll-hidden mb-6 ">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

              const isWished = wishlistIds.includes(course._id);

              return (
                <div
                  key={course.id || index}
                  className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden"
                >
                  <div className="relative overflow-hidden">
                    <Link
                      to={`/courseDetailsOverview/${course._id}`}
                      state={course}
                    >
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}${
                          course.thumbnail
                        }`}
                        alt={course.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform  duration-300"
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
                      onClick={() => toggleWishlist(course)}
                      className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2 shadow-sm transition-all duration-200 hover:scale-110"
                      aria-label={
                        isWished ? "Remove from wishlist" : "Add to wishlist"
                      }
                    >
                      {isWished ? (
                        <FaHeart className="w-4 h-4 text-red-500" />
                      ) : (
                        <FaRegHeart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                      )}
                    </button>
                  </div>

                  <div className="px-5 py-2 ">
                    <Link
                      to={`/courseDetailsOverview/${course._id}`}
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
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <Link
                        to={`/courseDetailsOverview/${course._id}`}
                        state={course}
                        className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                      >
                        View Program
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <ToastContainer autoClose={1000} />
        </div>
      </div> */}
      <div className="max-w-screen-2xl mx-auto ">
  <div className="px-4 sm:px-10 lg:px-20">
    <div className="flex gap-2 md:justify-center overflow-x-auto whitespace-nowrap scroll-hidden mb-6">
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

    {/* NOTE: items-stretch ensures each grid item stretches to same height */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
      {filteredCourses.map((course, index) => {
        const averageRating =
          course.reviews && course.reviews.length > 0
            ? (
                course.reviews.reduce((sum, review) => sum + review.rating, 0) /
                course.reviews.length
              ).toFixed(1)
            : null;

        const totalLessons =
          course.modules?.reduce(
            (sum, module) => sum + (module.lessons?.length || 0),
            0
          ) || 0;

        const isWished = wishlistIds.includes(course._id);

        return (
          // Make card a column flex that fills the grid cell
          <div
            key={course.id || index}
            className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden flex flex-col h-full"
          >
            <div className="relative overflow-hidden">
              {/* <Link to={`/courseDetailsOverview/${course._id}`} state={course}> */}
              <Link to={`/courseDetailsOverview/${course.title.toLowerCase().replace(/\s+/g, '-')}`} state={course}>
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
                onClick={() => toggleWishlist(course)}
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

            {/* Make content grow so footer can stick to bottom */}
            <div className="px-5 py-2 flex-1 flex flex-col">
              {/* <Link to={`/courseDetailsOverview/${course._id}`} state={course}> */}
              <Link to={`/courseDetailsOverview/${course.title.toLowerCase().replace(/\s+/g, '-')}`} state={course}>
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
                </div>
              </div>

              {/* footer — mt-auto pushes it to the bottom */}
              <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100">
                <Link
                  // to={`/courseDetailsOverview/${course._id}`}
                  to={`/courseDetailsOverview/${course.title.toLowerCase().trim().replace(/\s+/g, '-')}`}
                  state={course}
                  className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                >
                  View Program
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

export default CourseList;
