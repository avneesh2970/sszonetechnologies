// src/hooks/useCourseCounts.js
import { useEffect, useMemo, useState } from "react";
import { getProgress } from './ProgressStore';
import { getTotalLessons } from "./totals";

// helper: flatten unique purchased courses
const uniquePurchasedCourses = (purchases=[]) => {
  const map = new Map();
  purchases.forEach(p =>
    (p.product || []).forEach(c => c?._id && map.set(c._id, c))
  );
  return Array.from(map.values());
};

export default function useCourseCounts(purchases, userId="anon") {
  const [bump, setBump] = useState(0);

  // react to progress changes from other pages
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key && e.key.includes("courseProgress_v2")) setBump(x => x + 1);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const courses = useMemo(() => uniquePurchasedCourses(purchases), [purchases]);

  const { activeCount, completedCount, enrollCount } = useMemo(() => {
    let active = 0, completed = 0, enroll = 0;

    for (const course of courses) {
      const total = getTotalLessons(course);
      const { started, completedLessons } = getProgress(userId, course._id);

      if (total > 0 && completedLessons >= total) {
        completed++;
      } else if (started) {
        active++;
      } else {
        enroll++;
      }
    }
    return { activeCount: active, completedCount: completed, enrollCount: enroll };
  }, [courses, userId, bump]);

  return { totalPurchased: courses.length, activeCount, completedCount, enrollCount };
}
