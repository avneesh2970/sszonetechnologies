import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudentAuth } from "./studentAuth"; // adjust path
import { getProgress, setProgress } from "./utils/ProgressStore"; // same store as before
import { getTotalLessons, percent } from "./utils/totals";        // same helpers


function shortWords(text = "", words = 4) {
  const parts = (text || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length <= words) return text;
  return parts.slice(0, words).join(" ") + "...";
}

// Small card per course with a range slider
function CourseProgressRow({ course, userId, onChanged }) {
  const total = getTotalLessons(course);
  const { started, completedLessons } = getProgress(userId, course._id);
  const pct = percent(completedLessons, total);

  const displayTitle = shortWords(course.title, 4); // change 4 -> 5 if you prefer 5 words


  return (
    
    <div className="">
  {/* Course title + % */}
  <div className="flex items-center justify-between">
    <div className="min-w-0">
          <div
            className="font-medium text-slate-800 text-sm md:text-base break-words cursor-pointer"
            title={course.title} // shows full title on hover
          >
            {displayTitle}
          </div>

          <div className="text-xs text-gray-400 mt-0.5">
            {completedLessons}/{total} lessons
          </div>
        </div>
    <div className="text-sm font-medium text-blue-600">{pct}%</div>
  </div>

  {/* Progress bar */}
  <input
  type="range"
  min={0}
  max={total || 1}
  step={1}
  value={completedLessons}
  onChange={(e) => {
    const v = Math.max(0, Math.min(total, e.target.valueAsNumber || 0));
    setProgress(userId, course._id, { started: true, completedLessons: v });
    onChanged?.();
  }}
  disabled={total === 0}
  className="course-progress"
  style={{
    // percent fill for CSS to consume
    '--pct': `${Math.max(0, Math.min(100, ((completedLessons / (total || 1)) * 100))) }%`,
  }}
/>

  {/* Lesson count */}
  {/* <div className="text-xs text-slate-500">
    {completedLessons}/{total} lessons
  </div> */}
</div>

  );
}

export default function DashboardCourseProgress() {
  const { purchases = [], user } = useStudentAuth();
  const userId = user?.id || user?._id || "anon";
  const navigate = useNavigate();

  const [bump, setBump] = useState(0); // force re-render when store changes

  // React to progress changes made on other pages
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key && e.key.includes("courseProgress_v2")) setBump((x) => x + 1);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Flatten unique purchased courses
  const courses = useMemo(() => {
    const map = new Map();
    purchases.forEach((p) => (p.product || []).forEach((c) => c?._id && map.set(c._id, c)));
    return Array.from(map.values());
  }, [purchases]);

  // Aggregate stats for header
  const stats = useMemo(() => {
    let totalLessonsAll = 0;
    let completedAll = 0;
    let active = 0;
    let completed = 0;

    for (const c of courses) {
      const total = getTotalLessons(c);
      const { started, completedLessons } = getProgress(userId, c._id);

      totalLessonsAll += total;
      completedAll += Math.min(completedLessons, total);

      if (total > 0 && completedLessons >= total) completed++;
      else if (started) active++;
    }
    const pctAll =
      totalLessonsAll > 0 ? Math.round((completedAll / totalLessonsAll) * 100) : 0;

    return { pctAll, active, completed };
  }, [courses, userId, bump]);

  if (courses.length === 0) {
    return (
      <div className="p-4 rounded-xl border bg-white shadow-sm">
        <div className="text-slate-600">No purchased courses yet.</div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header / Summary */}
      {/* <div className="p-4 rounded-xl border bg-white shadow-sm flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">Overall Progress</div>
          <div className="text-2xl font-semibold">{stats.pctAll}%</div>
          <div className="text-xs text-slate-500 mt-1">
            Active: {stats.active} • Completed: {stats.completed}
          </div>
        </div>
        <button
          onClick={() => navigate("/dashboard/enrollCourse")}
          className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
        >
          View All Courses
        </button>
      </div> */}

      {/* List of courses with sliders (limit to 6; adjust as you like) */}
      <div className="grid gap-2 ">
        {courses.slice(0, 6).map((course) => (
          <CourseProgressRow
            key={course._id}
            course={course}
            userId={userId}
            onChanged={() => setBump((x) => x + 1)}
          />
        ))}
      </div>
    </div>
  );
}