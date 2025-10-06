// src/utils/progressStore.js
const STORAGE_KEY = "courseProgress_v2"; // versioned to avoid old shape conflicts

export const loadAll = (userId) => {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}:${userId || "anon"}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const saveAll = (userId, data) => {
  localStorage.setItem(`${STORAGE_KEY}:${userId || "anon"}`, JSON.stringify(data));
  // Notify other tabs/components (same window listeners also receive this synthetic event)
  try {
    window.dispatchEvent(new StorageEvent("storage", { key: `${STORAGE_KEY}:${userId || "anon"}` }));
  } catch {
    // Some browsers might not allow constructing StorageEvent — safe to ignore.
  }
};

const emptyCourseProgress = {
  started: false,
  completedLessons: 0,
  completedLessonIds: [], // avoid double-counting
};

export const getProgress = (userId, courseId) => {
  const all = loadAll(userId);
  const p = all[courseId] || emptyCourseProgress;
  // migration guard
  if (!Array.isArray(p.completedLessonIds)) p.completedLessonIds = [];
  if (typeof p.completedLessons !== "number") p.completedLessons = p.completedLessonIds.length;
  return p;
};

export const setProgress = (userId, courseId, patch) => {
  const all = loadAll(userId);
  const prev = getProgress(userId, courseId);
  const next = { ...prev, ...patch };

  if (Array.isArray(next.completedLessonIds)) {
    next.completedLessons = next.completedLessonIds.length;
  } else {
    next.completedLessons = Math.max(0, Number(next.completedLessons) || 0);
  }

  all[courseId] = next;
  saveAll(userId, all);
  return next;
};

export const markLessonDone = (userId, courseId, lessonId) => {
  const p = getProgress(userId, courseId);
  if (!p.completedLessonIds.includes(lessonId)) {
    return setProgress(userId, courseId, {
      started: true,
      completedLessonIds: [...p.completedLessonIds, lessonId],
    });
  }
  return p;
};

export const unmarkLessonDone = (userId, courseId, lessonId) => {
  const p = getProgress(userId, courseId);
  if (p.completedLessonIds.includes(lessonId)) {
    return setProgress(userId, courseId, {
      completedLessonIds: p.completedLessonIds.filter((id) => id !== lessonId),
    });
  }
  return p;
};
