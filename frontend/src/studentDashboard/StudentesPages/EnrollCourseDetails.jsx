import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ReactPlayer from "react-player";
import { FaArrowLeft, FaRegStarHalfStroke } from "react-icons/fa6";
import {
  FaDribbble,
  FaLinkedin,
  FaRegStar,
  FaStar,
  FaTwitter,
} from "react-icons/fa";
import { MdCurrencyRupee } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";

export default function StudentCourseDetail(courseId) {
  const { id } = useParams(); // changed from slug → id
  const [course, setCourse] = useState(null);
  const [showVideo, setShowVideo] = useState({});
  const [activeTab, setActiveTab] = useState("Overview");
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  // Fetch purchased course by ID
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/payment/my-purchases`,
          { withCredentials: true }
        );

        const purchasedCourses = res.data.purchases.flatMap((p) => p.product);
        const matchedCourse = purchasedCourses.find((c) => c._id === id); // match by ID
        setCourse(matchedCourse);
      } catch (err) {
        console.error("Error fetching purchased course", err);
      }
    };

    fetchCourse();
  }, [id]);

  //fetch course review
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/reviews/${course._id}`,
        { rating, comment },
        { withCredentials: true }
      );

      toast.success("Review added successfully!");
      setComment("");
      setRating(5);

      // refresh reviews list
      fetchReviews();
    } catch (error) {
      toast.error("Something went wrong: " + error.response?.data?.message);
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

  const averageRating =
    reviews?.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  // Tabs Content
  const content = {
    Overview: (
      <div className="px-6 md:px-12 my-6">
        <h1 className="text-xl font-bold mb-4">Description</h1>
        <p className="text-gray-600 mb-6">
          {course.overviewdescription ||
            course.description ||
            course.overview?.overviewDescription ||
            "No description available."}
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
      <div className="px-6 md:px-12 my-6 ">
        <div className="flex  p-4 gap-8 items-center">
          {/* <img
            src={
              course.instructor?.profile?.avatar || "/images/default-user.png"
            }
            alt="Instructor"
            className="w-40 h-40 rounded-full object-cover mx-auto md:mx-0"
          /> */}
          <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold uppercase mx-auto md:mx-0">
            {course.instructor?.name
              ? course.instructor.name.slice(0, 2).toUpperCase()
              : "NA"}
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-xl font-bold">{course.instructor?.name}</h1>

            <p className=" font-semibold">
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
      <>
        <div className="mt-6">
          {/* Reviews Section */}
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Student Reviews
          </h2>

          <div className="space-y-4">
            {reviews.length === 0 && (
              <p className="text-gray-500 italic">
                No reviews yet. Be the first to review this course!
              </p>
            )}
            <h3 className="text-lg font-semibold">
              Average Rating:{" "}
              <span className="text-yellow-500">{averageRating} ⭐</span>
            </h3>

            {reviews?.map((r) => (
              <div key={r._id} className=" rounded-lg p-4 shadow-sm bg-white">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                      {r.userId.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{r.userId.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(r.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-yellow-500 font-medium">
                    {"⭐".repeat(r.rating)}{" "}
                    <span className="text-gray-600 text-sm">
                      ({r.rating}/5)
                    </span>
                  </div>
                </div>
                <p className="text-gray-700">{r.comment}</p>
              </div>
            ))}
          </div>

          {/* Add Review Form */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3">Write a Review</h3>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 border rounded-lg p-4 bg-gray-50 shadow-sm"
            >
              <label className="text-sm font-medium text-gray-700">
                Rating
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="mt-1 border rounded-md p-2 w-full"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r} Star{r > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-medium text-gray-700">
                Comment
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this course..."
                  className="mt-1 border rounded-md p-2 w-full h-24"
                />
              </label>

              <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </>
    ),
    Announcement: (
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
    ),
  };

  return (
    <>
      {/* 🎬 Course Banner */}
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl">
        {activeVideoUrl && ReactPlayer.canPlay(activeVideoUrl) ? (
          <div className="">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
              <div
                className="flex items-center gap-3 mb-4 group"
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft className="text-gray-400 group-hover:text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-400 group-hover:text-blue-600">
                  Back
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
                  {Array.from({ length: 5 }).map((_, i) => {
                    const starNumber = i + 1;
                    if (averageRating >= starNumber) {
                      return <span key={i}>★</span>; // full star
                    } else if (averageRating >= starNumber - 0.5) {
                      return <span key={i}>⯨</span>; // half star (you can replace with an icon or character)
                    } else {
                      return <span key={i}>☆</span>; // empty star
                    }
                  })}
                </div>
                <span className="text-slate-600 font-medium">
                  ({averageRating})
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
}
