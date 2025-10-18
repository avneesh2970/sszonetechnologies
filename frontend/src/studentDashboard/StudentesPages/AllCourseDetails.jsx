

import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ReactPlayer from "react-player";
import { FaArrowLeft } from "react-icons/fa6";
import { FaStar, FaRegStar } from "react-icons/fa";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import { FaTwitter, FaDribbble, FaLinkedin } from "react-icons/fa";
import { MdCurrencyRupee } from "react-icons/md";
import { FiLock } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";

import Card from "../../componant/Card.jsx";
import QuizModal from "../../pages/QuizModel"; // adjust if path differs
import { useStudentAuth } from "./studentAuth";
import {
  getProgress,
  setProgress,
  markLessonDone,
} from "./utils/ProgressStore";
import { getTotalLessons, percent } from "./utils/totals";
import { useCartContext } from "../../context/CartContext.jsx";

/**
 * StudentCourseFullDetails
 * - Merges features from your enrollCourseDetails and allCourseDetails files.
 * - Supports: course passed via location.state OR fetches course by id.
 * - Keeps all existing UI blocks (Overview, Curriculum, Instructor, Review, Announcement).
 * - Includes expand/collapse modules, quiz modal + robust fetch, assignment status + upload,
 *   progress slider, mark-as-done on video end, add-to-cart, paid check, review modal.
 */

export default function StudentCourseFullDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useStudentAuth();
  const  { fetchCartItems } = useCartContext()
  const userId = user?.id || user?._id || "anon";

  console.log("cykoRavish", location.state);
  // Primary course state: prefer location.state (all-course view), else fetch
  const [course, setCourse] = useState(location.state || null);

  // UI + player states
  const [activeTab, setActiveTab] = useState("Overview");
  const [activeVideoUrl, setActiveVideoUrl] = useState(
    location.state?.introVideo?.videoUrl || null
  );
  const [openLessonId, setOpenLessonId] = useState(null); // which lesson is currently open
  const [currentLessonId, setCurrentLessonId] = useState(null); // used for marking on video end
  const [showVideo, setShowVideo] = useState({}); // per-lesson toggle (backwards compat)

  // reviews
  const [reviews, setReviews] = useState([]);

  // assignments
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [subStatus, setSubStatus] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");

  // quizzes
  const [showModal, setShowModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // progress related
  const [force, setForce] = useState(0); // used to re-render after progress store changes

  // paid/enrolled
  const [paid, setPaid] = useState(false);

  // review modal/form
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // module expand/collapse
  const [expandedModules, setExpandedModules] = useState(() => new Set());

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };
  const allModuleIds = useMemo(
    () => (course?.modules || []).map((m) => m._id),
    [course]
  );
  const expandAll = () => setExpandedModules(new Set(allModuleIds));
  const collapseAll = () => setExpandedModules(new Set());

  // helper: fetch course if not provided via location.state
  // useEffect(() => {
  //   if (course) return;
  //   const fetchCourseById = async () => {
  //     try {
  //       const { data } = await axios.get(
  //         `${import.meta.env.VITE_BACKEND_URL}/api/courses/${id}`,
  //         { withCredentials: true }
  //       );
  //       setCourse(data);
  //       if (data?.introVideo?.videoUrl)
  //         setActiveVideoUrl(data.introVideo.videoUrl);
  //     } catch (err) {
  //       console.error("Failed to fetch course by id:", err);
  //       // as fallback: try to find in purchases (enrolled view)
  //       try {
  //         const resp = await axios.get(
  //           `${import.meta.env.VITE_BACKEND_URL}/api/payment/my-purchases`,
  //           { withCredentials: true }
  //         );
  //         const purchasedCourses = resp.data.purchases.flatMap(
  //           (p) => p.product
  //         );
  //         const matched = purchasedCourses.find((c) => c._id === id);
  //         setCourse(matched || null);
  //         if (matched?.introVideo?.videoUrl)
  //           setActiveVideoUrl(matched.introVideo.videoUrl);
  //       } catch (err2) {
  //         console.error("Also failed to fetch purchases:", err2);
  //       }
  //     }
  //   };
  //   fetchCourseById();
  // }, [id, course]);

  // fetch reviews for course
  const fetchReviews = async (courseId) => {
    if (!courseId) return;
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/reviews/${courseId}`
      );
      setReviews(data || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    if (!course?._id) return;
    fetchReviews(course._id);
    // initial active video
    if (course.introVideo?.videoUrl)
      setActiveVideoUrl(course.introVideo.videoUrl);
  }, [course?._id]);

  // check paid/enrolled status
  useEffect(() => {
    if (!course?._id) return;
    (async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/payment/is-paid/${
            course._id
          }`,
          { withCredentials: true }
        );
        setPaid(Boolean(data.paid));
      } catch (err) {
        console.log("Error checking paid status:", err?.message || err);
      }
    })();
  }, [course?._id]);

  // keep in sync when other tabs change storage progress (StudentCourseDetail behavior)
  useEffect(() => {
    const onStorage = (e) => {
      if (!e.key || !e.key.includes("courseProgress_v2")) return;
      setForce((x) => x + 1);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // progress helpers
  const totalLessons = getTotalLessons(course || {});
  const { completedLessons, completedLessonIds } = getProgress(
    userId,
    course?._id
  );
  const pct = percent(completedLessons, totalLessons);

  // review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!course?._id) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/reviews/${course._id}`,
        { rating, comment },
        { withCredentials: true }
      );
      toast.success("Review added successfully!");
      setComment("");
      setRating(5);
      setIsReviewOpen(false);
      await fetchReviews(course._id);
    } catch (err) {
      toast.error(
        "Something went wrong: " + (err.response?.data?.message || err.message)
      );
    }
  };

  // --- QUIZ: robust openModal (works with passed object or id) ---
  const openModal = async (quizOrId) => {
    const base = import.meta.env.VITE_BACKEND_URL || "";

    function findQuestions(obj) {
      if (!obj || typeof obj !== "object") return null;
      if (Array.isArray(obj.questions)) return obj;
      for (const k of Object.keys(obj)) {
        const v = obj[k];
        if (Array.isArray(v) && k.toLowerCase().includes("question")) {
          return { questions: v, ...obj };
        }
        if (v && typeof v === "object") {
          if (Array.isArray(v.questions)) return v;
        }
      }
      return null;
    }

    try {
      if (
        quizOrId &&
        typeof quizOrId === "object" &&
        Array.isArray(quizOrId.questions)
      ) {
        setSelectedQuiz(quizOrId);
        setAnswers(new Array(quizOrId.questions.length).fill(null));
        setResult(null);
        setShowModal(true);
        return;
      }

      const quizId = typeof quizOrId === "string" ? quizOrId : quizOrId?._id;
      if (!quizId) {
        toast.error("Invalid quiz id");
        return;
      }

      const endpoints = [
        `${base}/api/quiz/${quizId}`,
        `${base}/api/quizzes/${quizId}`,
      ];

      let data = null;
      for (const url of endpoints) {
        try {
          const resp = await axios.get(url, { withCredentials: true });
          data = resp.data;
          if (data) break;
        } catch (err) {
          console.warn("openModal fetch failed for", url, err?.message || err);
        }
      }

      if (!data) throw new Error("No response from quiz endpoints");

      let quizCandidate = data.quiz || data.data?.quiz || data.data || data;

      if (!Array.isArray(quizCandidate?.questions)) {
        const maybe =
          findQuestions(data) ||
          findQuestions(data.quiz) ||
          findQuestions(data.data) ||
          findQuestions(quizCandidate);
        if (maybe) quizCandidate = maybe;
      }

      if (!quizCandidate || !Array.isArray(quizCandidate.questions)) {
        console.error("openModal: no questions found. response:", data);
        toast.error("Quiz data missing questions — check server response.");
        return;
      }

      setSelectedQuiz(quizCandidate);
      setAnswers(new Array(quizCandidate.questions.length).fill(null));
      setResult(null);
      setShowModal(true);
    } catch (err) {
      console.error("openModal error:", err);
      toast.error(
        err.response?.data?.message || err.message || "Failed to load quiz"
      );
    }
  };

  // submit quiz
  const handleSubmitQuiz = async () => {
    if (!selectedQuiz) return;
    if (
      answers.length !== (selectedQuiz.questions?.length || 0) ||
      answers.some((a) => a === null || a === undefined)
    ) {
      toast.error("Please answer all questions before submitting.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/quiz/submit`,
        { quizId: selectedQuiz._id, answers },
        { withCredentials: true }
      );
      setResult(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit quiz");
    } finally {
      setLoading(false);
    }
  };

  // ASSIGNMENTS: fetch status when selectedAssignment changes
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
          { withCredentials: true }
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

  const onSubmitAssignment = async () => {
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
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
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

  // Add to cart
  const addToCart = async (c) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/add`,
        { courseId: c._id },
        { withCredentials: true }
      );
      toast.success("Added to cart");
      fetchCartItems();
      navigate("/dashboard/cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  // LESSON toggle: open only one at a time, set active video, set progress started
  const handleLessonToggle = (lesson) => {
    const willOpen = openLessonId !== lesson._id;
    setOpenLessonId(willOpen ? lesson._id : null);
    setCurrentLessonId(willOpen ? lesson._id : null);

    // maintain backward-compatible showVideo map too
    setShowVideo((prev) => ({
      ...prev,
      [lesson._id]: willOpen,
    }));

    setActiveVideoUrl(
      willOpen ? lesson.lessonVideoSource : course.introVideo?.videoUrl || null
    );

    // mark started (persist)
    setProgress(userId, course._id, { started: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // When video ends: mark lesson done and update progress
  const onPlayerEnded = async () => {
    if (!currentLessonId) return;
    markLessonDone(userId, course._id, currentLessonId);
    setForce((x) => x + 1);
    const prog = getProgress(userId, course._id);
    if (prog.completedLessons >= totalLessons) {
      toast.success("🎉 Course completed!");
    } else {
      toast.success("✅ Lesson marked as completed");
    }
  };

  const formatName = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const handleShare = async () => {
    try {
      if (!navigator.share) {
        toast.info("Sharing not supported on this device");
        return;
      }

      const pageUrl = window.location.href;
      let imageUrl = course?.thumbnail;

      if (!imageUrl) {
        toast.info("No image available to share");
        return;
      }

      // Convert relative URL to absolute (if needed)
      if (imageUrl.startsWith("/")) {
        imageUrl = `${window.location.origin}${imageUrl}`;
      }

      // Fetch image as blob
      const response = await fetch(imageUrl, { mode: "cors" });
      if (!response.ok) throw new Error("Failed to fetch image");

      const blob = await response.blob();
      const file = new File([blob], "course-image.jpg", { type: blob.type });

      // Check if browser supports file sharing
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: course?.title || "Course",
          text:
            course?.overview?.overviewDescription ||
            course?.description ||
            "Check out this course!",
          files: [file],
          url: pageUrl,
        });
        toast.success("Course shared with image!");
      } else {
        // Fallback: share without image
        await navigator.share({
          title: course?.title,
          text: course?.overview?.overviewDescription || course?.title,
          url: pageUrl,
        });
        toast.info("Shared course link (image not supported)");
      }
    } catch (error) {
      console.error("Share failed:", error);
      toast.error("Could not share course");
    }
  };

  // average rating from reviews state (fetched)
  const averageRating =
    reviews?.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : course?.rating ?? 0;

  // safeguard - if course still null show loading
  if (!course) {
    return <p className="text-center text-gray-500 mt-6">Loading course...</p>;
  }

  // ---------- Tab contents ----------
  const OverviewTab = (
    <div className="px-6 md:px-12 my-6">
      <h1 className="text-xl font-bold mb-4">Description</h1>
      <p className="text-gray-600 mb-6">
        {course.overviewdescription ||
          course.description ||
          course.overview?.overviewDescription ||
          "No description available."}
      </p>

      <div className="mt-6 p-4 border rounded-lg bg-slate-50">
        <div className="flex justify-between">
          <p className="text-sm text-slate-600">Course Progress</p>
          <p className="text-sm text-slate-600">{pct}%</p>
        </div>
        <input
          type="range"
          min={0}
          max={totalLessons || 1}
          step={1}
          value={completedLessons}
          onChange={(e) => {
            const v = Math.max(
              0,
              Math.min(totalLessons, e.target.valueAsNumber || 0)
            );
            setProgress(userId, course._id, {
              started: true,
              completedLessons: v,
            });
            setForce((x) => x + 1);
            if (totalLessons > 0 && v >= totalLessons) {
              toast.success("🎉 Course completed!");
            }
          }}
          className="w-full mt-2"
          disabled={totalLessons === 0}
        />
        <div className="text-xs text-slate-500 mt-1">
          {completedLessons}/{totalLessons} lessons
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-6">
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
  );

  const CurriculumTab = (
    <>
      <div>
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
            course.modules.map((module, midx) => {
              const disabledModule = !paid;
              const isExpanded = expandedModules.has(module._id);

              return (
                <div
                  key={module._id}
                  className={`mb-4 border border-gray-200 rounded overflow-hidden ${
                    disabledModule ? "opacity-70" : ""
                  }`}
                >
                  {/* Module header (clickable) */}
                  <button
                    type="button"
                    onClick={() => toggleModule(module._id)}
                    className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50"
                    aria-expanded={isExpanded}
                  >
                    <div>
                      <h3 className="font-bold text-left text-md">
                        Module {midx + 1}: {module.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {module.lessons?.length || 0} lessons ·{" "}
                        {module.quizzes?.length || 0} quizzes ·{" "}
                        {module.assignments?.length || 0} assignments
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {!paid && <FiLock className="text-gray-500 text-lg" />}
                      <svg
                        className={`w-5 h-5 transform transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : "rotate-0"
                        } text-gray-500`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.356a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </button>

                  {/* Collapsible content */}
                  <div
                    className={`bg-gray-50 overflow-hidden transition-[max-height] duration-300 ease-in-out`}
                    style={{ maxHeight: isExpanded ? "2000px" : "0px" }}
                  >
                    <div
                      className={`p-4 ${
                        disabledModule
                          ? "pointer-events-none cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <h4 className="font-medium">Lesson:</h4>
                      {/* Lessons */}
                      <ul className=" pl-5 space-y-1 text-sm mt-2">
                        {module.lessons?.length > 0 ? (
                          module.lessons.map((lesson, lidx) => {
                            const formattedTime = `${lesson.lessonHour || 0}h ${
                              lesson.lessonMinute || 0
                            }m ${lesson.lessonSecond || 0}s`;
                            const isDone = completedLessonIds.includes(
                              lesson._id
                            );

                            return (
                              <>
                                <li key={lesson._id} className="">
                                  <div className="flex justify-between items-center">
                                    <div
                                      // title acts as the toggle now
                                      className={`font-medium transition cursor-pointer ${
                                        openLessonId === lesson._id
                                          ? "text-blue-600 font-semibold"
                                          : "text-gray-800 hover:text-blue-500"
                                      }`}
                                      onClick={() => {
                                        if (!paid) {
                                          toast.info(
                                            "This module is locked. Please enroll to access the lessons."
                                          );
                                          return;
                                        }

                                        const willOpen =
                                          openLessonId !== lesson._id; // toggle
                                        // keep the showVideo map for backward compatibility elsewhere
                                        setShowVideo((prev) => ({
                                          ...prev,
                                          [lesson._id]: willOpen,
                                        }));
                                        setOpenLessonId(
                                          willOpen ? lesson._id : null
                                        );
                                        setCurrentLessonId(
                                          willOpen ? lesson._id : null
                                        );

                                        setActiveVideoUrl(
                                          willOpen
                                            ? lesson.lessonVideoSource ||
                                                course?.introVideo?.videoUrl ||
                                                null
                                            : course?.introVideo?.videoUrl ||
                                                null
                                        );

                                        // mark started in progress store
                                        setProgress(userId, course._id, {
                                          started: true,
                                        });

                                        // scroll to the top/player
                                        window.scrollTo({
                                          top: 0,
                                          behavior: "smooth",
                                        });
                                      }}
                                    >
                                      {/* {lidx + 1}. {lesson.lessonTitle} */}
                                      {lesson.lessonTitle}
                                    </div>

                                    {/* show lock icon when disabled */}
                                    {!paid && (
                                      <FiLock className="text-gray-400 text-sm" />
                                    )}
                                  </div>
                                  {/* 
                                <p className="text-gray-600 text-sm mt-2">
                                  {lesson.lessonContent}
                                </p> */}
                                </li>
                              </>
                            );
                          })
                        ) : (
                          <li className="text-gray-400 italic">
                            No lessons in this module.
                          </li>
                        )}
                      </ul>

                      {/* Quizzes */}
                      <div className="mt-4">
                        <h4 className="font-medium">Quizzes:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                          {module.quizzes?.length > 0 ? (
                            module.quizzes.map((q) => (
                              <li
                                key={q._id}
                                className={`flex justify-between items-center ${
                                  paid
                                    ? "cursor-pointer hover:underline hover:text-blue-500"
                                    : "cursor-not-allowed text-gray-500"
                                }`}
                                onClick={() => {
                                  if (paid) openModal(q);
                                  else
                                    toast.info(
                                      "Quiz is locked. Enroll to attempt."
                                    );
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  {q.title}
                                  {!paid && (
                                    <FiLock className="text-gray-400 text-sm" />
                                  )}
                                </div>
                                <span>{paid ? "Attempt Quiz" : "Locked"}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-gray-400 italic">
                              No Quiz in this module.
                            </li>
                          )}
                        </ul>

                        {/* Quiz modal once per page */}
                        <QuizModal
                          isOpen={showModal}
                          quiz={selectedQuiz}
                          onClose={() => {
                            setShowModal(false);
                            setSelectedQuiz(null);
                            setAnswers([]);
                            setResult(null);
                          }}
                          answers={answers}
                          setAnswers={setAnswers}
                          onSubmit={handleSubmitQuiz}
                          loading={loading}
                          result={result}
                        />
                      </div>

                      {/* Assignments */}
                      <div className="mt-4">
                        <h4 className="font-medium">Assignments:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                          {module.assignments?.length > 0 ? (
                            module.assignments.map((assignment) => (
                              <li
                                key={assignment._id}
                                className={`flex justify-between items-center ${
                                  paid
                                    ? "cursor-pointer hover:underline hover:text-blue-500"
                                    : "cursor-not-allowed text-gray-500"
                                }`}
                                onClick={() => {
                                  if (paid) setSelectedAssignment(assignment);
                                  else
                                    toast.info(
                                      "Assignment locked. Enroll to view details."
                                    );
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  {assignment.title}
                                  {!paid && (
                                    <FiLock className="text-gray-400 text-sm" />
                                  )}
                                </div>
                                <span>{paid ? "full-details" : "Locked"}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-gray-400 italic">
                              No assignments in this module.
                            </li>
                          )}
                        </ul>

                        {/* Assignment modal */}
                        {selectedAssignment && (
                          <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
                            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
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

                              <h2 className="text-xl font-bold mb-2">
                                {selectedAssignment.title}
                              </h2>
                              <p className="text-gray-700 mb-4">
                                {selectedAssignment.summary}
                              </p>

                              <h3 className="font-semibold mb-2">Questions:</h3>
                              <ul className="list-decimal pl-5 space-y-2 text-gray-600">
                                {selectedAssignment.questions?.map(
                                  (q, index) => (
                                    <li key={index}>{q.questionText || q}</li>
                                  )
                                )}
                              </ul>

                              <div className="border-t my-4" />

                              <div className="mb-3">
                                <h4 className="font-semibold">
                                  Your submission
                                </h4>
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
                                      <div className="flex flex-col sm:flex-row gap-2">
                                        <p className="font-medium text-slate-700">
                                          PDF:
                                        </p>
                                        <div className="flex gap-3">
                                          <a
                                            href={subStatus.pdfUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-blue-600 underline"
                                          >
                                            View
                                          </a>
                                          <a
                                            href={subStatus.pdfUrl}
                                            download
                                            className="text-green-600 underline"
                                          >
                                            Download
                                          </a>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500 mt-1">
                                    No submission yet (pending).
                                  </p>
                                )}
                              </div>

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
                                    onClick={onSubmitAssignment}
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
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No modules found for this course.</p>
          )}
        </div>
      </div>
    </>
  );

  const InstructorTab = (
    <div className="px-6 md:px-12 my-6 ">
      <div className="flex p-4 gap-8 items-center">
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
  );

  const ReviewTab = (
    <>
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Student Review</h3>
          <button
            onClick={() => setIsReviewOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Add Comment
          </button>
        </div>

        <div className="space-y-4 mt-4">
          {reviews.length === 0 && (
            <p className="text-gray-500 italic">
              No reviews yet. Be the first to review this course!
            </p>
          )}
          <h3 className="text-base text-gray-400">
            Average Rating:{" "}
            <span className="text-yellow-500">{averageRating} ⭐</span>
          </h3>

          {reviews.map((r) => (
            <div key={r._id} className="rounded-lg p-4 shadow-sm bg-white">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                    {r.userId?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-semibold">
                      {r.userId?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(r.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-yellow-500 font-medium">
                  {"⭐".repeat(r.rating)}{" "}
                  <span className="text-gray-600 text-sm">({r.rating}/5)</span>
                </div>
              </div>
              <p className="text-gray-700">{r.comment}</p>
            </div>
          ))}

          {/* Review modal */}
          {isReviewOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center"
              aria-modal="true"
              role="dialog"
            >
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setIsReviewOpen(false)}
              />
              <div className="relative z-10 w-full max-w-lg mx-4">
                <div className="bg-white rounded-lg shadow-xl">
                  <div className="flex items-center justify-between px-5 py-4 border-b">
                    <h4 className="text-base font-semibold">Write a Review</h4>
                    <button
                      onClick={() => setIsReviewOpen(false)}
                      className="p-2 rounded hover:bg-gray-100"
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>
                  <form onSubmit={handleSubmitReview} className="p-5 space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Rating
                      <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="mt-1 border rounded-md p-2 w-full"
                      >
                        {[5, 4, 3, 2, 1].map((r) => (
                          <option key={r} value={r}>
                            {r} Star{r > 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block text-sm font-medium text-gray-700">
                      Comment
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your experience with this course..."
                        className="mt-1 border rounded-md p-2 w-full h-28"
                      />
                    </label>
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsReviewOpen(false)}
                        className="px-4 py-2 rounded-md border hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Submit Review
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const AnnouncementTab = (
    <>
      {course.announcement?.length > 0 ? (
        <div className="mt-2">
          <h4 className="font-medium text-gray-700">Announcements:</h4>
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
  );

  const content = {
    Overview: OverviewTab,
    Curriculum: CurriculumTab,
    Instructor: InstructorTab,
    Review: ReviewTab,
    Announcement: AnnouncementTab,
  };

  return (
    <>
      {/* Banner / Player */}
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl">
        {activeVideoUrl && ReactPlayer.canPlay(activeVideoUrl) ? (
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
                controls
                width="100%"
                height="500px"
                playing={true}
                onEnded={onPlayerEnded}
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

      {/* Course Info */}
      <div className="p-6">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full -translate-y-16 translate-x-16 opacity-60"></div>

          <h1 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
            {course.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                Instructor
              </h3>
              <p className="text-xl font-semibold text-slate-900">
                {course.instructor?.name}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                Category
              </h3>
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full">
                {course.categories}
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                Rating
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400 text-xl">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const starNumber = i + 1;
                    if (averageRating >= starNumber)
                      return <span key={i}>★</span>;
                    if (averageRating >= starNumber - 0.5)
                      return <span key={i}>⯨</span>;
                    return <span key={i}>☆</span>;
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

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8">
              <div className="flex border-b border-slate-200 overflow-x-auto">
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
                ))}
              </div>
              <div className="p-8">{content[activeTab]}</div>
            </div>
          </div>

          <aside className="lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sticky top-8">
              <div className="mb-8">
                <div className="flex items-baseline gap-2 mb-2">
                  <MdCurrencyRupee className="h-8 w-8 text-green-600" />
                  <span className="text-4xl font-bold text-slate-900">
                    {course.discountPrice}
                  </span>
                </div>
                <p className="text-green-600 font-medium">Limited time offer</p>
              </div>

              <button
                onClick={() => addToCart(course)}
                aria-label={`Add ${course?.title || "course"} to cart`}
                className={`w-full py-3 rounded-lg mb-4 font-medium ${
                  paid
                    ? "text-black border border-green-400 cursor-not-allowed"
                    : "bg-blue-700 hover:bg-blue-800 text-white cursor-pointer"
                }`}
                disabled={paid}
              >
                {paid ? "Enrolled" : "Add To Cart"}
              </button>

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
                      condition: !!course?.overview?.certificate,
                    },
                    {
                      label: "Access on Mobile & TV",
                      condition: !!course?.overview?.accessOnMobileAndTV,
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

              {/* <div className="pt-6 border-t border-slate-200">
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
              </div> */}
            </div>
          </aside>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={1000} />
    </>
  );
}
