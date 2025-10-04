import React, { useEffect, useState } from "react";
import {
  useLocation,
  Link,
  useParams,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import { FaTwitter, FaDribbble, FaLinkedin } from "react-icons/fa";
import { MdCurrencyRupee } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

import Card from "../componant/Card";
import avatar from "../assets/image/avatar.png";
import all_course from "../assets/Course_Data";
import ReactPlayer from "react-player";
import LessonVideoPlayer from "../Instructor-courseUpload/LassonVideoPlayer";
import { useStudentAuth } from "../studentDashboard/StudentesPages/studentAuth";

const CourseDetails = () => {
  const { id } = useParams(); // getting from URL
  const location = useLocation();
  const course = location.state;
  const { fetchCartItems } = useStudentAuth();
  const [showVideo, setShowVideo] = useState({});
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);
  const navigate = useNavigate();

  //  assignment and submit
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [subStatus, setSubStatus] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      if (!selectedAssignment?._id) return;
      setStatusLoading(true);
      setMsg("");

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/assignments/${
            selectedAssignment._id
          }/my-status`,
          {
            withCredentials: true, // ✅ include cookies
          }
        );

        if (!res.data.success)
          throw new Error(res.data.message || "Failed to load status");

        setSubStatus(res.data);
      } catch (err) {
        setMsg(
          err.response?.data?.message ||
            err.message ||
            "Could not fetch submission status"
        );
        setSubStatus(null);
      } finally {
        setStatusLoading(false);
      }
    };

    fetchStatus();
  }, [selectedAssignment]);

  // 🧠 Validate PDF file
  const onFileChange = (e) => {
    setMsg("");
    const f = e.target.files?.[0];
    if (!f) return setFile(null);

    if (f.type !== "application/pdf") {
      setMsg("Only PDF files are allowed.");
      e.target.value = "";
      return setFile(null);
    }
    if (f.size > 10 * 1024 * 1024) {
      setMsg("File too large. Max 10MB.");
      e.target.value = "";
      return setFile(null);
    }
    setFile(f);
  };

  // 🧠 Submit assignment PDF
  const onSubmit = async () => {
    if (!selectedAssignment?._id) return;
    if (!file) {
      setMsg("Please choose a PDF file first.");
      return;
    }

    setUploading(true);
    setMsg("");

    try {
      const form = new FormData();
      form.append("pdf", file);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/assignments/${
          selectedAssignment._id
        }/submit`,
        form,
        {
          withCredentials: true, // ✅ include cookies
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!res.data.success)
        throw new Error(res.data.message || "Submission failed");

      setMsg("✅ Assignment submitted successfully.");
      setFile(null);

      setSubStatus((prev) => ({
        ...(prev || {}),
        status: "completed",
        pdfUrl: res.data.submission?.pdfUrl || prev?.pdfUrl,
        submittedAt:
          res.data.submission?.submittedAt || new Date().toISOString(),
      }));
    } catch (err) {
      setMsg(
        err.response?.data?.message ||
          err.message ||
          "Submission failed. Try again."
      );
    } finally {
      setUploading(false);
    }
  };

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

  // it is from api but i am fetching error from course
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

  const averageRating =
    reviews?.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

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

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700">
                  Assignments:
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                  {module.assignments?.length > 0 ? (
                    module.assignments.map((assignment) => (
                      <li
                        key={assignment._id}
                        className="flex justify-between cursor-pointer hover:underline hover:text-blue-500"
                        onClick={() => setSelectedAssignment(assignment)}
                      >
                        {assignment.title} <span>full-details</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400 italic">
                      No assignments in this module.
                    </li>
                  )}
                </ul>

                {/* 🔹 Modal */}
                {selectedAssignment && (
                  <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                      {/* Close */}
                      <button
                        onClick={() => {
                          setSelectedAssignment(null);
                          setSubStatus(null);
                          setFile(null);
                          setMsg("");
                        }}
                        className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl"
                      >
                        ✖
                      </button>

                      {/* Assignment Info */}
                      <h2 className="text-xl font-bold mb-2">
                        {selectedAssignment.title}
                      </h2>
                      <p className="text-gray-700 mb-4">
                        {selectedAssignment.summary}
                      </p>

                      <h3 className="font-semibold mb-2">Questions:</h3>
                      <ul className="list-decimal pl-5 space-y-2 text-gray-600">
                        {selectedAssignment.questions?.map((q, index) => (
                          <li key={index}>{q.questionText || q}</li>
                        ))}
                      </ul>

                      <div className="border-t my-4" />

                      {/* 🔹 Status */}
                      <div className="mb-3">
                        <h4 className="font-semibold">Your submission</h4>
                        {statusLoading ? (
                          <p className="text-sm text-gray-500 mt-1">
                            Loading status…
                          </p>
                        ) : subStatus ? (
                          <div className="text-sm mt-1 space-y-1">
                            <p>
                              Status:{" "}
                              <span
                                className={
                                  subStatus.status === "completed"
                                    ? "text-green-600 font-medium"
                                    : "text-yellow-700 font-medium"
                                }
                              >
                                {subStatus.status || "pending"}
                              </span>
                            </p>
                            {subStatus.submittedAt && (
                              <p className="text-gray-600">
                                Submitted:{" "}
                                {new Date(
                                  subStatus.submittedAt
                                ).toLocaleString()}
                              </p>
                            )}
                            {subStatus.pdfUrl && (
                              <p>
                                PDF:{" "}
                                <a
                                  className="text-blue-600 underline break-all"
                                  href={subStatus.pdfUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  View / Download
                                </a>
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 mt-1">
                            No submission yet (pending).
                          </p>
                        )}
                      </div>

                      {/* 🔹 Upload Form */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">
                          Upload PDF
                        </label>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={onFileChange}
                          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {file && (
                          <p className="text-xs text-gray-500">
                            Selected: {file.name} (
                            {(file.size / (1024 * 1024)).toFixed(2)} MB)
                          </p>
                        )}

                        {msg && (
                          <p
                            className={`text-sm ${
                              msg.startsWith("✅")
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {msg}
                          </p>
                        )}

                        <div className="flex items-center gap-2 pt-2">
                          <button
                            disabled={uploading || !file}
                            onClick={onSubmit}
                            className={`px-4 py-2 rounded-md text-white ${
                              uploading || !file
                                ? "bg-blue-300 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                          >
                            {uploading
                              ? "Submitting…"
                              : subStatus?.status === "completed"
                              ? "Re-submit PDF"
                              : "Submit PDF"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
        {course.reviews.length === 0 && (
          <p className="text-gray-500 italic">
            No reviews yet. Be the first to review this course!
          </p>
        )}

        {course.reviews.map((review, index) => (
          <div
            key={index}
            className="flex items-start gap-4 pb-4 mb-4  border-gray-200"
          >
            {/* Avatar */}
            <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
              {review.userId?.name?.[0]?.toUpperCase() || "U"}
            </div>

            {/* Review Content */}
            <div className="flex-1 ">
              {/* Name + Date */}
              <div className="flex  gap-2 items-center ">
                <h1 className="text-sm font-semibold">
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
              <p className=" text-gray-700 leading-relaxed text-sm">
                {review.comment}
              </p>

              {/* Rating */}
              <div className="flex gap-1  text-yellow-400 text-sm">
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <div className="p-3">
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}${course.thumbnail}`}
          alt="Course Banner"
          className="h-[50vh] md:h-[70vh] w-full object-contain object-center rounded"
        />
      </div>

      <div className="relative">
        <div className="shadow-lg bg-white px-6 py-4 max-w-3xl md:mx-6 mx-auto rounded-xl  md:-mt-10">
          <h1 className="text-2xl font-bold mb-3">{course.title}</h1>
          <div className="flex flex-wrap md:flex-nowrap gap-6">
            <div className="flex-1">
              <h3 className="text-gray-500">Instructor</h3>
              <p className="font-semibold">{course.instructor.name}</p>
            </div>
            <div className="flex-1">
              <h3 className="text-gray-500">Category</h3>
              <p className="font-semibold"> {course.categories}</p>
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
      </div>

      <div className="flex flex-col md:flex-row gap-8 px-6 md:px-12 my-12">
        <div className="flex-1">
          <div className="flex gap-4 border-b mb-6 overflow-x-auto">
            {[
              "Overview",
              "Curriculum",
              "Instructor",
              "Review",
              "Announcement",
            ].map((tab) => (
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

        <aside className="w-full md:w-[400px] flex-shrink-0  p-4 rounded-xl bg-white lg:-mt-43 -mt-10 ">
          {/* <img src={video} alt="Demo Video" className="rounded-md mb-6" /> */}
          {activeVideoUrl && ReactPlayer.canPlay(activeVideoUrl) ? (
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
          )}

          <div className="flex items-center ">
            <MdCurrencyRupee className="h-6 w-6" />
            <h2 className="text-2xl font-bold">{course.discountPrice}</h2>
          </div>

          <button
            onClick={() => addToCart(course)}
            className="cursor-pointer w-full bg-blue-700 text-white py-3 rounded-lg mb-6 hover:bg-blue-800"
          >
            Add To Cart
          </button>

          <p className="text-xl font-semibold mb-2"> This Course Includes </p>
          <div className="flex flex-col gap-2 text-gray-600">
            <p>✅ {course?.overview?.videoHours || 5}hrs on-demand video</p>
            <p>
              ✅ Instructor:{" "}
              {course?.overview?.overviewInstructor || course.instructor.name}
            </p>
            <p>
              ✅ Language:{" "}
              {course?.overview?.overviewLanguage || "Hindi,English"}
            </p>
            <p>✅ Level:{course?.overview?.courseLevel || "Beginner"}</p>
            <p>
              {course?.overview?.certificate ? "✅ " : "❌ "}
              Certificate
            </p>
            <p>
              {course?.overview?.accessOnMobileAndTV ? "✅ " : "❌ "}
              Access on Mobile & TV
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
        </aside>
      </div>

      <div className="px-6 md:px-12 my-20 text-center">
        <h2 className="text-blue-500 text-sm">Explore Recommended Courses</h2>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          You Might Also Like
        </h1>
        <p className="text-gray-600 mb-12">
          Discover personalized course recommendations curated to match your
          interests and learning goals.
        </p>

        <Card all_course={all_course.slice(0, 3)} />
      </div>
      <ToastContainer position="top-right" autoClose={1000} />
    </>
  );
};

export default CourseDetails;
