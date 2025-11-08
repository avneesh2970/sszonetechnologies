import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useStudentAuth } from "./studentAuth";
import { getProgress, setProgress } from "./utils/ProgressStore"; // <-- new
import { getTotalLessons, percent } from "./utils/totals"; // <-- new
import { FaBook, FaRegStar } from "react-icons/fa6";

const TabButton = ({ label, active, onClick }) => (
  <button
    className={`px-4 py-2 font-semibold ${
      active ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

const EnrollCourse = () => {
  const { purchases = [], user } = useStudentAuth();
  const userId = user?.id || user?._id || "anon";
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Enroll");
  const [progressVersion, setProgressVersion] = useState(0); // re-render on store changes

  // keep in sync when details page updates progress
  useEffect(() => {
    const onStorage = (e) => {
      if (!e.key || !e.key.includes("courseProgress_v2")) return;
      setProgressVersion((v) => v + 1);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Flatten purchased courses
  const purchasedCourses = useMemo(() => {
    const list = [];
    for (const p of purchases) {
      for (const c of p.product || []) {
        if (c && c._id) list.push(c);
      }
    }
    const map = new Map();
    list.forEach((c) => map.set(c._id, c));
    return Array.from(map.values());
  }, [purchases]);

  const enrollCourses = useMemo(() => purchasedCourses, [purchasedCourses]);

  const activeCourses = useMemo(() => {
    return purchasedCourses.filter((course) => {
      const total = getTotalLessons(course);
      const { started, completedLessons } = getProgress(userId, course._id);
      if (total === 0) return started && completedLessons === 0;
      return started && completedLessons < total;
    });
  }, [purchasedCourses, userId, progressVersion]);

  const completedCourses = useMemo(() => {
    return purchasedCourses.filter((course) => {
      const total = getTotalLessons(course);
      const { completedLessons } = getProgress(userId, course._id);
      return total > 0 && completedLessons >= total;
    });
  }, [purchasedCourses, userId, progressVersion]);

  const handleGoToCourse = (course) => {
    setProgress(userId, course._id, { started: true });
    setProgressVersion((v) => v + 1);
    navigate(`/dashboard/enrollCourseDetails/${course._id}`);
  };

  const CourseCard = ({ course, showProgress, completedView }) => {
    const totalLessons = getTotalLessons(course);
    const { started, completedLessons } = getProgress(userId, course._id);
    const pct = percent(completedLessons, totalLessons);

    const averageRating =
      course.reviews && course.reviews.length > 0
        ? (
            course.reviews.reduce((sum, review) => sum + review.rating, 0) /
            course.reviews.length
          ).toFixed(1)
        : null;

    return (
      <div className="bg-white  rounded-lg shadow-md w-72 flex flex-col justify-between">
        <div
          className="relative cursor-pointer "
          onClick={() =>
            navigate(`/dashboard/enrollCourseDetails/${course._id}`)
          }
        >
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}${course.thumbnail}`}
            alt={course.title}
            className="w-full h-40 object-cover rounded-md"
          />
        </div>
        <div className="p-4">
          <span className="text-xs inline-block bg-blue-100 text-blue-600 rounded-full px-2 py-1 mt-2">
            {course.categories || "Development"}
          </span>

          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-1">
            {course.title}
          </h3>

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
              {course.reviews && course.reviews.length > 0 && (
                <span className="text-gray-400 ml-1">
                  ({course.reviews.length})
                </span>
              )}
            </div>
          </div>

          {showProgress && totalLessons > 0 && (
            <div className="mt-3">
              <div className="flex justify-between">
                <p className="text-xs text-gray-400">Complete</p>
                <p className="text-xs text-gray-400">{pct}%</p>
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
                  setProgressVersion((x) => x + 1);
                  if (totalLessons > 0 && v >= totalLessons) {
                    toast.success(`🎉 ${course.title} completed!`);
                  }
                }}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">
                {completedLessons}/{totalLessons} lessons
              </div>
            </div>
          )}

          {!completedView ? (
            <button
              onClick={() => handleGoToCourse(course)}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 focus:outline-none w-full focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              {started ? "Continue Course" : "Go to Course"}
            </button>
          ) : (
            <button
              onClick={() =>
                navigate(`/dashboard/certificates/${course._id}`, {
                  state: course,
                })
              }
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 focus:outline-none w-full focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              Download Certificate
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Enroll":
        return (
          <div className="flex flex-wrap gap-4 mt-6">
            {enrollCourses.length === 0 ? (
              <p className="text-sm text-gray-500">No courses purchased yet.</p>
            ) : (
              enrollCourses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  showProgress={false}
                  completedView={false}
                />
              ))
            )}
          </div>
        );

      case "Active":
        return (
          <div className="flex flex-wrap gap-4 mt-6">
            {activeCourses.length === 0 ? (
              <p className="text-sm text-gray-500">
                No active courses. Start any course from Enroll tab.
              </p>
            ) : (
              activeCourses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  showProgress
                  completedView={false}
                />
              ))
            )}
          </div>
        );

      case "Completed":
        return (
          <div className="flex flex-wrap gap-4 mt-6">
            {completedCourses.length === 0 ? (
              <p className="text-sm text-gray-500">No completed courses yet.</p>
            ) : (
              completedCourses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  showProgress={false}
                  completedView
                />
              ))
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
      <div className="flex space-x-6 border-b pb-2">
        <TabButton
          label="Enroll Courses"
          active={activeTab === "Enroll"}
          onClick={() => setActiveTab("Enroll")}
        />
        <TabButton
          label="Active Courses"
          active={activeTab === "Active"}
          onClick={() => setActiveTab("Active")}
        />
        <TabButton
          label="Completed Courses"
          active={activeTab === "Completed"}
          onClick={() => setActiveTab("Completed")}
        />
      </div>
      {renderContent()}
    </div>
  );
};

export default EnrollCourse;
