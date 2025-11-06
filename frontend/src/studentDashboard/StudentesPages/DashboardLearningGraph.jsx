import React, { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useStudentAuth } from './studentAuth'; // adjust path
import { getProgress } from "./utils/ProgressStore";       // shared store
import { getTotalLessons } from "./utils/totals";          // helper
import DashboardCourseProgress from "./DashboardCourseProgress";

const COLORS = ["#2563eb", "#e5e7eb"]; // blue (completed) + slate-200 (remaining)

function uniquePurchasedCourses(purchases = []) {
  const map = new Map();
  purchases.forEach((p) =>
    (p.product || []).forEach((c) => c?._id && map.set(c._id, c))
  );
  return Array.from(map.values());
}

export default function DashboardLearningGraph() {
  const { purchases = [], user } = useStudentAuth();
  const userId = user?.id || user?._id || "anon";
  const [bump, setBump] = useState(0);

  // live sync with other pages changing progress
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key && e.key.includes("courseProgress_v2")) setBump((x) => x + 1);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const courses = useMemo(() => uniquePurchasedCourses(purchases), [purchases]);

  const { totalLessonsAll, completedAll, barData } = useMemo(() => {
    let totalLessonsAll = 0;
    let completedAll = 0;

    const barData = courses.map((c) => {
      const total = getTotalLessons(c);
      const { completedLessons } = getProgress(userId, c._id);
      const done = Math.min(completedLessons, total);
      const remaining = Math.max(0, total - done);

      totalLessonsAll += total;
      completedAll += done;

      return {
        name: c.title?.length > 18 ? c.title.slice(0, 18) + "…" : c.title || "Course",
        completed: done,
        remaining,
        // for tooltip completeness
        total,
        fullName: c.title || "Course",
      };
    });

    return { totalLessonsAll, completedAll, barData };
  }, [courses, userId, bump]);

  const pieData =
    totalLessonsAll > 0
      ? [
          { name: "Completed", value: completedAll },
          { name: "Remaining", value: Math.max(0, totalLessonsAll - completedAll) },
        ]
      : [
          { name: "Completed", value: 0 },
          { name: "Remaining", value: 1 }, // show empty ring instead of nothing
        ];

  const overallPct =
    totalLessonsAll > 0 ? Math.round((completedAll / totalLessonsAll) * 100) : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Donut: Overall progress */}
      <div className="p-4 rounded-xl bg-gray-100 ">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-slate-800">Overall Learning Progress</h3>
          <div className="text-sm text-slate-600">
            {completedAll}/{totalLessonsAll} lessons
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={2}
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val, name) => [val, name]}
                contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb" }}
              />
              <Legend verticalAlign="bottom" height={24} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="text-center mt-2">
          <span className="text-3xl font-bold text-blue-600">{overallPct}%</span>
          <span className="ml-2 text-slate-500">complete</span>
        </div>
      </div>

      {/* Stacked bar: Per-course breakdown */}
      <div className="p-4 rounded-xl  bg-gray-100">
        <div className=" mb-3">
          <h3 className="text-lg font-medium text-slate-800">Per-Course Progress </h3>
          <span className="text-xs text-slate-500">Completed vs Remaining</span>
        </div>

      <div className="h-64 w-full overflow-y-scroll scrollbar-thin-custom pr-2">
          
          <DashboardCourseProgress/>
        </div>

      </div>
    </div>
  );
}
