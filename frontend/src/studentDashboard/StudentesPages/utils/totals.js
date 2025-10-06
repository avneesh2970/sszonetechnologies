// src/utils/totals.js
export const getTotalLessons = (course) =>
  Array.isArray(course?.modules)
    ? course.modules.reduce(
        (acc, m) => acc + (Array.isArray(m?.lessons) ? m.lessons.length : 0),
        0
      )
    : 0;

export const percent = (done, total) => (total > 0 ? Math.round((done / total) * 100) : 0);
