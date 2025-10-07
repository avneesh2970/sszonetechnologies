import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import { FaTwitter, FaDribbble, FaLinkedin } from "react-icons/fa";
import { MdCurrencyRupee } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

import Card from "../../componant/Card.jsx";

import ReactPlayer from "react-player";
import { useStudentAuth } from "./studentAuth.js";

const StuAllCourseDetails = () => {
  const { id } = useParams(); // getting from URL
  const location = useLocation();
  const course = location.state;
  const { fetchCartItems } = useStudentAuth();
  const [showVideo, setShowVideo] = useState({});
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);
  const navigate = useNavigate();

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
      setActiveVideoUrl(course.introVideo.videoUrl);
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

  const formatName = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
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
          course.modules.map((module, midx) => (
            <div
              key={module._id}
              className="mb-6 border border-gray-200 p-4 rounded"
            >
              <h2 className=" font-bold text-md mb-3">
                Module {midx + 1}: {module.title}
              </h2>

              <ul>
                {module.lessons?.length > 0 ? (
                  module.lessons.map((lesson, lidx) => {
                    const formattedTime = `${lesson.lessonHour || 0}h ${
                      lesson.lessonMinute || 0
                    }m ${lesson.lessonSecond || 0}s`;

                    return (
                      <li
                        key={lesson._id}
                        className="bg-white rounded-lg shadow-sm p-4 my-4"
                      >
                        {/* Title */}
                        <div className="flex justify-between items-center">
                          <div className="font-semibold text-gray-800">
                            {lidx + 1}. {lesson.lessonTitle}
                            <span className="text-sm text-gray-500 ml-2">
                              ({formattedTime})
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <p className="text-gray-600 mt-2">
                          {lesson.lessonContent}
                        </p>

                        {/* Video Toggle */}
                        <button
                          onClick={() => {
                            setShowVideo(
                              (prev) => ({
                                ...prev,
                                [lesson._id]: !prev[lesson._id],
                              }),
                              scrollTo(0, 0)
                            );

                            if (showVideo?.[lesson._id]) {
                              setActiveVideoUrl(
                                course?.introVideo?.videoUrl || null
                              );
                            } else {
                              setActiveVideoUrl(lesson.lessonVideoSource);
                            }
                          }}
                          className="mt-3 text-white bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded-md text-sm"
                        >
                          {showVideo?.[lesson._id]
                            ? "Hide Video"
                            : "Watch Course Video"}
                        </button>
                      </li>
                    );
                  })
                ) : (
                  <li className="text-gray-400 italic">
                    No lessons in this module.
                  </li>
                )}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No modules found for this course.</p>
        )}
      </div>
    ),
    Instructor: (
      <div className="px-6 md:px-12 my-6">
        <div className="flex p-4 gap-4 items-center">
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
        {reviews.length === 0 && (
          <p className="text-gray-500 italic">
            No reviews yet. Be the first to review this course!
          </p>
        )}
        {reviews.map((review, index) => (
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
    Announcement :(
         <>
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
         </>
    )
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      {/* 🎬 Course Banner */}
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl">
        {activeVideoUrl && ReactPlayer.canPlay(activeVideoUrl) ? (
          <div className="">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <h3 className="text-xl font-semibold text-slate-800">
                  Now Playing
                </h3>
              </div>
              <div className="rounded-lg overflow-hidden shadow-md">
                <ReactPlayer
                  url={activeVideoUrl}
                  controls={false}
                  width="100%"
                  height="500px"
                  playing={true}
                  config={{
                    youtube: {
                      playerVars: {
                        modestbranding: 1,
                        rel: 0,
                        showinfo: 0,
                        autoplay: 1,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-slate-200 rounded-full flex items-center justify-center">
              <span className="text-3xl">🎬</span>
            </div>
            <p className="text-slate-500 text-lg">
              No video available at the moment
            </p>
          </div>
        )}
      </div>

      {/* 📘 Course Info */}
      <div className="p-6">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 relative overflow-hidden">
          {/* Decorative Bubble */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full -translate-y-16 translate-x-16 opacity-60"></div>

          <h1 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
            {course.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Instructor */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                Instructor
              </h3>
              <p className="text-xl font-semibold text-slate-900">
                {course.instructor?.name}
              </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                Category
              </h3>
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full">
                {course.categories}
              </span>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                Rating
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400 text-xl">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>
                      {i < Math.round(course.rating) ? "★" : "☆"}
                    </span>
                  ))}
                </div>
                <span className="text-slate-600 font-medium">
                  ({course.rating})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📑 Main Layout */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Tabs */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8">
              <div className="flex border-b border-slate-200 overflow-x-auto">
                {["Overview", "Curriculum", "Instructor", "Review" , "Announcement"].map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`relative px-6 py-4 font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                        activeTab === tab
                          ? "text-blue-600 bg-blue-50"
                          : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                      )}
                    </button>
                  )
                )}
              </div>
              <div className="p-8">{content[activeTab]}</div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sticky top-8">
              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-2 mb-2">
                  <MdCurrencyRupee className="h-8 w-8 text-green-600" />
                  <span className="text-4xl font-bold text-slate-900">
                    {course.discountPrice}
                  </span>
                </div>
                <p className="text-green-600 font-medium">Limited time offer</p>
              </div>

              {/* Add to Cart */}
              <button
                onClick={() => addToCart(course)}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-4 rounded-xl transition-colors duration-200 mb-8"
              >
                Add To Cart
              </button>

              {/* Includes */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">
                  This Course Includes
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      label: `${
                        course?.overview?.videoHours || 5
                      } hours on-demand video`,
                      condition: true,
                    },
                    {
                      label: `Instructor: ${
                        course?.overview?.overviewInstructor ||
                        course.instructor?.name
                      }`,
                      condition: true,
                    },
                    {
                      label: `Language: ${
                        course?.overview?.overviewLanguage || "Hindi, English"
                      }`,
                      condition: true,
                    },
                    {
                      label: `Level: ${
                        course?.overview?.courseLevel || "Beginner"
                      }`,
                      condition: true,
                    },
                    {
                      label: "Certificate of Completion",
                      condition: course?.overview?.certificate,
                    },
                    {
                      label: "Access on Mobile & TV",
                      condition: course?.overview?.accessOnMobileAndTV,
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          item.condition ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        <span
                          className={`text-sm ${
                            item.condition ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {item.condition ? "✓" : "✗"}
                        </span>
                      </div>
                      <p className="text-slate-700 font-medium">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="pt-6 border-t border-slate-200">
                <div className="flex items-center gap-4">
                  <h4 className="font-semibold text-slate-900">Share:</h4>
                  <div className="flex gap-3">
                    <a
                      href="#"
                      className="w-10 h-10 bg-slate-100 hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors duration-200 group"
                    >
                      <FaDribbble className="text-slate-600 group-hover:text-blue-600" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-slate-100 hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors duration-200 group"
                    >
                      <FaLinkedin className="text-slate-600 group-hover:text-blue-600" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-slate-100 hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors duration-200 group"
                    >
                      <FaTwitter className="text-slate-600 group-hover:text-blue-600" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Toast */}
      <ToastContainer position="top-right" autoClose={1000} />
    </>
  );
};

export default StuAllCourseDetails;
