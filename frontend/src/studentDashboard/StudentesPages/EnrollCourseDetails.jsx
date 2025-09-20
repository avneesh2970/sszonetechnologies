import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactPlayer from "react-player";
import { FaRegStarHalfStroke } from "react-icons/fa6";
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
                            setShowVideo((prev) => ({
                              ...prev,
                              [lesson._id]: !prev[lesson._id],
                            }));

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
  };

  return (
    <>
      {/* Course Banner */}
      <div className="p-3">
        {/* <img
          src={`${import.meta.env.VITE_BACKEND_URL}${course.thumbnail}`}
          alt="Course Banner"
          className="h-[50vh] md:h-[70vh] w-full object-contain object-center rounded"
        /> */}
        {activeVideoUrl && ReactPlayer.canPlay(activeVideoUrl) ? (
          <div>
            <h3 className="text-lg font-semibold mb-2">📽️ Now Playing</h3>
            <ReactPlayer
              url={activeVideoUrl}
              controls
              width="100%"
              height="500px"
            />
          </div>
        ) : (
          <p className="text-red-500">⚠️ No video available</p>
        )}
      </div>

      {/* Course Info */}
      <div className="shadow-lg bg-white p-4 max-w-2xl md:ml-4 mx-auto rounded-xl md:-mt-2">
        <h1 className="text-2xl font-bold mb-3">{course.title}</h1>
        <div className="flex flex-wrap md:flex-nowrap gap-6">
          <div className="flex-1">
            <h3 className="text-gray-500">Instructor</h3>
            <p className="font-semibold">{course.instructor?.name}</p>
          </div>
          <div className="flex-1">
            <h3 className="text-gray-500">Category</h3>
            <p className="font-semibold">{course.categories}</p>
          </div>
          <div className="flex-1">
            <h3 className="text-gray-500">Review</h3>
            <div className="flex items-center gap-1 text-amber-300">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>
                  {i < Math.round(averageRating) ? "⭐" : ""}
                </span>
              ))}
              ({averageRating})
            </div>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="flex flex-col md:flex-row gap-8 px-6 md:px-12 my-12 border">
        {/* Tabs Section */}
        <div className="flex-1">
          <div className="flex gap-4 border-b mb-6 overflow-x-auto">
            {["Overview", "Curriculum", "Instructor", "Review"].map((tab) => (
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

        {/* Sidebar */}
        <aside className="w-full md:w-[400px] flex-shrink-0 p-2 border rounded-xl bg-white shadow-lg">
          {/* {activeVideoUrl && ReactPlayer.canPlay(activeVideoUrl) ? (
            <div>
              <h3 className="text-lg font-semibold mb-2">📽️ Now Playing</h3>
              <ReactPlayer
                url={activeVideoUrl}
                controls
                width="100%"
                height="360px"
              />
            </div>
          ) : (
            <p className="text-red-500">⚠️ No video available</p>
          )} */}

          <div className="flex items-center mt-4">
            <MdCurrencyRupee className="h-6 w-6" />
            <h2 className="text-2xl font-bold">{course.discountPrice}</h2>
          </div>

          <p className="text-xl font-semibold mb-2 mt-4">
            This Course Includes
          </p>
          <div className="flex flex-col gap-2 text-gray-600">
            <p>✅ {course?.overview?.videoHours || 5}hrs on-demand video</p>
            <p>
              ✅ Instructor:{" "}
              {course?.overview?.overviewInstructor || course.instructor?.name}
            </p>
            <p>
              ✅ Language:{" "}
              {course?.overview?.overviewLanguage || "Hindi,English"}
            </p>
            <p>✅ Level: {course?.overview?.courseLevel || "Beginner"}</p>
            <p>{course?.overview?.certificate ? "✅ " : "❌ "}Certificate</p>
            <p>
              {course?.overview?.accessOnMobileAndTV ? "✅ " : "❌ "}Access on
              Mobile & TV
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

          <ToastContainer position="top-right" autoClose={2000} />
        </aside>
      </div>
    </>
  );
}
