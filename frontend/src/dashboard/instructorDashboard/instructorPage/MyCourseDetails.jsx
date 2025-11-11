import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaStar, FaRegStar, FaEdit, FaTrash } from "react-icons/fa";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import avatar from "../../../assets/image/avatar.png";
import { MdCurrencyRupee } from "react-icons/md";
import { FaDribbble, FaLinkedin, FaTwitter } from "react-icons/fa";
import ReactPlayer from "react-player";
import LessonVideoPlayer from "../../../Instructor-courseUpload/LassonVideoPlayer";
import EditCourseModal from "../../../Instructor-courseUpload/CourseEdit";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModuleForm from "../../../Instructor-courseUpload/ModuleForm";
import UpdateModule from "./UpdateModule";
import AddQuestionsForm from "../../../Instructor-courseUpload/AddQuestion";
import QuizForm from "../../../Instructor-courseUpload/UploadQuiz";
import AddAssignment from "../../../Instructor-courseUpload/Assignment";
import InsAnnouncement from "../../../Instructor-courseUpload/Announcement";
import InstructorCourseSubmissions from "./OrderHistory";
import AdminQuizModal from "../../adminDashboard/adminPage/AdminQuizModal";

const InstructorCourseDetails = () => {
  const location = useLocation();
  const course = location.state;

  const { courseId: courseIdFromParams } = useParams();
  const courseId = course?._id || courseIdFromParams;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedCourse, setUpdatedCourse] = useState(course);

  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);

  const [editingModule, setEditingModule] = useState(null);

  const [isOpen, setIsOpen] = useState(false);

  const [isAssignmentOpen, setIsAssignmentOpen] = useState(false);

  // const [selectedAssignment, setSelectedAssignment] = useState(null);

  const [openAnn, setOpenAnn] = useState(false);

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [subStatus, setSubStatus] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Fetch student submission status when popup opens
  useEffect(() => {
    const fetchStatus = async () => {
      if (!selectedAssignment?._id) return;
      setStatusLoading(true);
      setMsg("");
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/assignments/${
            selectedAssignment._id
          }/my-status`,
          {
            method: "GET",
            credentials: "include", // ✅ include cookies for auth
          }
        );
        const data = await res.json();
        if (!data.success)
          throw new Error(data.message || "Failed to load status");
        setSubStatus(data);
      } catch (err) {
        setMsg(err.message || "Could not fetch status");
        setSubStatus(null);
      } finally {
        setStatusLoading(false);
      }
    };
    fetchStatus();
  }, [selectedAssignment]);

  // Validate PDF file
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

  // Submit assignment PDF
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

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/assignments/${
          selectedAssignment._id
        }/submit`,
        {
          method: "POST",
          credentials: "include", // ✅ include cookies automatically
          body: form,
        }
      );

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Submission failed");

      setMsg("✅ Assignment submitted successfully.");
      setFile(null);
      setSubStatus((prev) => ({
        ...(prev || {}),
        status: "completed",
        pdfUrl: data.submission?.pdfUrl || prev?.pdfUrl,
        submittedAt: data.submission?.submittedAt || new Date().toISOString(),
      }));
    } catch (err) {
      setMsg(err.message || "Submission error");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [activeTab, setActiveTab] = useState("Overview");

  if (!course) {
    return (
      <div className="text-center text-red-600 font-bold p-10">
        ❌ Course not found!
      </div>
    );
  }

  const handleDeleteModule = async (moduleId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this module?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/course-structure/module/${moduleId}`,
        { withCredentials: true }
      );

      toast.success("Module deleted successfully!");

      // Update local state so UI reflects deletion
      setUpdatedCourse((prev) => ({
        ...prev,
        modules: prev.modules.filter((m) => m._id !== moduleId),
      }));
    } catch (error) {
      toast.error("Failed to delete module");
      console.error(error);
    }
  };

  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);

  const handleDeleteCourse = async (courseId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/instructor-courses/${courseId}`,
        {
          withCredentials: true,
        }
      );
      toast.success("Course deleted successfully!");
      setCourses(courses.filter((c) => c._id !== courseId));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete course");
    }
  };

  //    Status change draft to pending (Course Status)
  const handleStatusChange = async (newStatus) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/instructor-courses/${
          course._id
        }/status`,
        { status: newStatus },
        {
          withCredentials: true,
        }
      );

      toast.success(`Status updated to ${newStatus}`);
      console.log(res.data.course);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating status");
    }
  };

  // For edit course

  const handleUpdated = (course) => {
    // Update local state after successful edit
    console.log("Updated course:", course);
    setIsModalOpen(false);
  };

  // Update remark status
  const handelRemarkStatusUPdate = async (remarkId) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/remark/${remarkId}/status`,
        { status: "Done" },
        { withCredentials: true }
      );

      toast.success("Remark marked as Done ");

      // ✅ Update local state immediately
    } catch (error) {
      toast.error("Failed to update remark status: " + error.message);
    }
  };

  // put this inside your CourseDetails component (replace your old openModal)
  const openModal = async (quizOrId) => {
    const base = import.meta.env.VITE_BACKEND_URL || "";

    // helper: shallow search for a "questions" array anywhere in an object
    function findQuestions(obj) {
      if (!obj || typeof obj !== "object") return null;
      if (Array.isArray(obj.questions)) return obj;
      // search top-level keys
      for (const k of Object.keys(obj)) {
        const v = obj[k];
        if (Array.isArray(v) && k.toLowerCase().includes("question")) {
          // e.g. data.questions or data.quizQuestions
          return { questions: v, ...obj };
        }
        if (v && typeof v === "object") {
          // nested object (one level deep)
          if (Array.isArray(v.questions)) return v;
        }
      }
      return null;
    }

    try {
      // if a fully-populated quiz object passed (has questions array), use it directly
      if (
        quizOrId &&
        typeof quizOrId === "object" &&
        Array.isArray(quizOrId.questions)
      ) {
        console.log(
          "openModal: using passed-in populated quiz object",
          quizOrId
        );
        setSelectedQuiz(quizOrId);
        setAnswers(new Array(quizOrId.questions.length).fill(null));
        setResult(null);
        setShowModal(true);
        return;
      }

      // extract id if an object was passed
      const quizId = typeof quizOrId === "string" ? quizOrId : quizOrId?._id;
      if (!quizId) {
        toast.error("Invalid quiz id");
        return;
      }

      // try two common endpoints (tolerant)
      const endpoints = [
        `${base}/api/quiz/${quizId}`,
        `${base}/api/quizzes/${quizId}`,
      ];

      let resp = null;
      let data = null;
      for (const url of endpoints) {
        try {
          console.log("openModal: fetching quiz from", url);
          resp = await axios.get(url, { withCredentials: true });
          data = resp.data;
          console.log("openModal: raw response for", url, resp);
          // if we got something, break and inspect
          if (data) break;
        } catch (err) {
          console.warn(
            "openModal: fetch failed for",
            url,
            err?.response?.status || err.message
          );
          // continue to try next endpoint
        }
      }

      if (!data) {
        throw new Error("No response from quiz endpoints");
      }

      // possible shapes:
      // 1) { success: true, quiz: { ... } }
      // 2) { quiz: { ... } }
      // 3) { ...quizFields... } (quiz object directly)
      // 4) { data: { quiz: {...} } } etc.

      // try to extract the quiz object
      let quizCandidate = data.quiz || data.data?.quiz || data.data || data;

      // If quizCandidate still has wrapper keys (e.g. { success:true, quiz: {...} }), search deeper
      if (!Array.isArray(quizCandidate?.questions)) {
        const maybe =
          findQuestions(data) ||
          findQuestions(data.quiz) ||
          findQuestions(data.data) ||
          findQuestions(quizCandidate);
        if (maybe) {
          // maybe is object that contains questions
          quizCandidate = maybe;
        }
      }

      // final check
      if (!quizCandidate || !Array.isArray(quizCandidate.questions)) {
        console.error(
          "openModal: could not find questions in the server response. Full response:",
          data
        );
        toast.error(
          "Quiz data missing questions — check server response (see console)."
        );
        return;
      }

      // success — set state
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

  // decode and convert player.cloudinary.com embed -> direct mp4 url
  const normalizeCloudinaryUrl = (url) => {
    try {
      if (!url) return url;
      const u = new URL(url);
      // player.cloudinary.com/embed/?cloud_name=...&public_id=...
      if (u.hostname.includes("player.cloudinary.com")) {
        const params = Object.fromEntries(u.searchParams.entries());
        const cloud = params.cloud_name || params.cloud;
        const publicId = params.public_id || params.publicId;
        if (!cloud || !publicId) return url;
        // public_id may be URL-encoded (samples%2Felephants) -> decode
        const decoded = decodeURIComponent(publicId);
        return `https://res.cloudinary.com/${cloud}/video/upload/${decoded}.mp4`;
      }

      // also accept direct res.cloudinary.com links already
      return url;
    } catch (err) {
      return url;
    }
  };

  const playableUrl = normalizeCloudinaryUrl(course.introVideo.videoUrl);

  const content = {
    Overview: (
      <div className="px-6 md:px-12 my-6">
        <h1 className="text-xl font-bold mb-4">Description </h1>
        <p className="text-gray-600 mb-6">
          {course?.overview?.overviewDescription || course.description}
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
        <h2 className="text-xl font-bold mb-4">Course Modules</h2>

        <div className="flex justify-end gap-4 mb-4">
          {/* Add Module */}
          <button
            onClick={() => setIsAddModuleOpen(true)}
            className=" border px-4 py-1 rounded"
          >
            + Add Module & Lesson
          </button>

          {/* Add Quiz */}
          <button
            onClick={() => setIsOpen(true)}
            className=" border px-4 py-1 rounded"
          >
            + Add Quiz
          </button>

          {/* Add Assignment */}
          <button
            onClick={() => setIsAssignmentOpen(true)}
            className=" border px-4 py-1 rounded"
          >
            + Add Assignment
          </button>
        </div>

        {/* ---------------- Add Quiz Modal ---------------- */}
        {isOpen && (
          <div className="fixed inset-0 bg-gray-200 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl"
              >
                ✖
              </button>
              <QuizForm courseId={courseId} />
            </div>
          </div>
        )}

        {/* ---------------- Add Module Modal ---------------- */}
        {isAddModuleOpen && (
          <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50   ">
            <div className="overflow-y-auto max-h-[95vh] scrollbar-thin-custom">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative ">
                <button
                  onClick={() => setIsAddModuleOpen(false)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl"
                >
                  ✖
                </button>
                <ModuleForm
                  courseId={course._id}
                  onClose={() => setIsAddModuleOpen(false)}
                  onModuleAdded={() => {
                    fetchCourseDetails();
                    toast.success("✅ Module added!");
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ---------------- Add Assignment Modal ---------------- */}
        {isAssignmentOpen && (
          <div className="fixed inset-0 bg-gray-200 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
              <button
                onClick={() => setIsAssignmentOpen(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl"
              >
                ✖
              </button>
              <AddAssignment
                courseId={courseId}
                onClose={() => {
                  setIsAssignmentOpen(false);
                  fetchCourseDetails(); // refresh after assignment added
                }}
              />
            </div>
          </div>
        )}

        <p className="text-md font-medium mt-2 text-gray-400">
          Total Lessons:{" "}
          {updatedCourse.modules?.reduce(
            (sum, module) => sum + (module.lessons?.length || 0),
            0
          ) || 0}
        </p>

        {updatedCourse.modules?.map((module) => (
          <div
            key={module._id}
            className="mt-4 border border-gray-200 p-4 rounded"
          >
            {/* Module Title + Actions */}
            <div className="flex justify-between">
              <span className="font-semibold ">{module.title}</span>
              <div>
                <button
                  onClick={() => setEditingModule(module)}
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  <FaEdit size={18} />
                </button>

                <button
                  onClick={() => handleDeleteModule(module._id)}
                  className="text-red-600 hover:text-red-800 ml-3 cursor-pointer"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            </div>

            {/* Lessons Section */}
            <div className="mt-3">
              <h4 className="text-sm font-medium text-gray-700">Lessons:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                {module.lessons?.length > 0 ? (
                  module.lessons.map((lesson) => (
                    <LessonVideoPlayer
                      key={lesson._id}
                      lesson={lesson}
                      modules={updatedCourse.modules}
                    />
                  ))
                ) : (
                  <li className="text-gray-400 italic">
                    No lessons in this module.
                  </li>
                )}
              </ul>
            </div>

            {/* Assignments Section */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">Quizzes:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                {module.quizzes?.length > 0 ? (
                  module.quizzes.map((q) => (
                    <li
                      key={q._id}
                      className={`flex justify-between items-center cursor-pointer hover:underline hover:text-blue-500`}
                      onClick={() => {
                        // keep your openModal behavior
                        openModal(q);
                      }}
                    >
                      <div className="flex items-center gap-2">{q.title}</div>
                      <span> Quiz Details</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400 italic">
                    No Quiz in this module.
                  </li>
                )}
              </ul>
              <AdminQuizModal
                isOpen={showModal}
                quiz={selectedQuiz}
                onClose={() => {
                  setShowModal(false);
                  setSelectedQuiz(null);
                }}
              />
            </div>

            {/* new assignment with form submit  */}
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
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Modal for editing */}
        {editingModule && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-[400px]">
              <UpdateModule
                moduleData={editingModule}
                onSuccess={(updated) => {
                  // refresh UI after success
                  setEditingModule(null);
                }}
                onClose={() => setEditingModule(null)}
              />
              <button
                onClick={() => setEditingModule(null)}
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    ),

    Instructor: (
      <div className="px-6 md:px-12 my-6 ">
        <div className="flex justify- p-4 gap-2  items-center">
          <img src={avatar} alt="Instructor" className="w-40 mx-auto md:mx-0" />
          <div className="flex flex-col gap-3">
            <h1 className="text-xl font-bold">{course.instructor.name}</h1>

            <p className=" font-semibold">
              <span className="font-bold text-gray-700">Occupation :</span>{" "}
              {course.instructor.profile?.skill || "No skills listed"}
            </p>

            <p className="text-gray-600">
              <span className="font-bold text-gray-700">Bio :</span>{" "}
              {course.instructor.profile?.bio || "No bio available"}
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
    Announcement: (
      <>
        <div className="flex justify-end">
          <button
            onClick={() => setOpenAnn(true)}
            className="border px-4 py-1 rounded flex"
          >
            + Add Announcements
          </button>
        </div>

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
        {openAnn && (
          <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
              <button
                onClick={() => setOpenAnn(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl"
              >
                ✖
              </button>
              <InsAnnouncement
                courseId={courseId}
                onClose={() => {
                  setOpenAnn(false);
                }}
              />
            </div>
          </div>
        )}
      </>
    ),
    Assignment: (
      <div>
        <InstructorCourseSubmissions courseId={courseId} />
      </div>
    ),
  };

  return (
    <>
      <div className="relative ">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 bg-white/80 hover:bg-white text-gray-800 md:font-medium md:px-4 md:py-2 px-2 py-0.5 rounded-full shadow-md flex items-center gap-2 transition"
        >
          ← Back
        </button>

        {/* Banner Image */}
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}${course.thumbnail}`}
          alt="Course Banner"
          className="h-[50vh] md:h-[70vh] w-full object-cover object-center rounded-lg shadow"
        />
      </div>

      <div className="relative ">
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
                {Array.from({ length: 5 }, (_, i) => {
                  if (i < Math.floor(course.rating)) return <FaStar key={i} />;
                  if (i < course.rating) return <FaRegStarHalfStroke key={i} />;
                  return <FaRegStar key={i} />;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 px-6 md:px-12 my-12 ">
        <div className="flex-1">
          <div className="flex gap-4 border-b mb-6 overflow-x-auto">
            {[
              "Overview",
              "Curriculum",
              "Instructor",
              "Review",
              "Announcement",
              "Assignment",
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

          <div className="mb-8">
            <h2 className="text-xl font-semibold mt-6">Remarks from Admin:</h2>
            {course.remarks?.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {course.remarks.map((r) => (
                  <li key={r._id} className="border p-2 rounded-md bg-gray-50">
                    <p>{r.courseRemark}</p>
                    <span className="text-sm text-gray-500">
                      Status: {r.status}
                    </span>

                    {r.status === "Pending" && (
                      <button
                        onClick={() => handelRemarkStatusUPdate(r._id)}
                        className="ml-4 bg-green-600 text-white px-3 py-1 rounded-md"
                      >
                        Mark as Done
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No remarks yet.</p>
            )}
          </div>
        </div>

        <aside className="w-full md:w-[390px] flex-shrink-0  p-4 rounded-xl bg-white lg:-mt-50 -mt-10 z-10 ">
          {/* <img src={video} alt="Demo Video" className="rounded-md mb-6" /> */}

          {playableUrl && ReactPlayer.canPlay(playableUrl) ? (
            <ReactPlayer
              url={playableUrl}
              controls
              width="100%"
              height="360px"
            />
          ) : (
            <p className="text-sm text-red-500">
              Video URL not playable. Try direct Cloudinary file link.
            </p>
          )}

          <div className="flex items-center ">
            <MdCurrencyRupee className="h-6 w-6" />
            <h2 className="text-2xl font-bold">{course.discountPrice}</h2>
          </div>
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
          <div className="mt-4">
            <p>
              <strong>Current Status:</strong> {course.status}
            </p>

            {course.status === "Draft" && (
              <button
                onClick={() => handleStatusChange("Pending")}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                Send for Review
              </button>
            )}

            {course.status === "Pending" && (
              <>
                <p className="text-yellow-600 font-semibold mt-2">
                  Waiting for approval...
                </p>
              </>
            )}

            {course.status === "Published" && (
              <p className="text-green-600 font-semibold mt-2">Live ✅</p>
            )}
          </div>

          <div className="mt-4">
            <>
              <button
                className="border w-full mt-4 p-1 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                onClick={() => setIsModalOpen(true)}
              >
                Edit Course
              </button>

              <button
                className="border w-full p-1 text-blue-500 rounded-lg mt-2"
                onClick={() => handleDeleteCourse(course._id)}
              >
                Delete Course
              </button>
            </>

            {isModalOpen && (
              <EditCourseModal
                course={updatedCourse}
                onClose={() => setIsModalOpen(false)}
                onUpdated={handleUpdated}
              />
            )}
          </div>
        </aside>
        <ToastContainer position="top-right" autoClose={1000} />
      </div>
    </>
  );
};

export default InstructorCourseDetails;
