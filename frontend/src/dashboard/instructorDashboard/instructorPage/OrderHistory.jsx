// InstructorCourseSubmissions.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function InstructorCourseSubmissions({ courseId }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setMsg("");
      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/assignments/courses/${courseId}/submissions`;
        const { data } = await axios.get(url, {
          params: { status: "completed", page: 1, limit: 50 }, // tweak as you like
          withCredentials: true, // ✅ send cookie for auth
        });
        if (!data.success) throw new Error(data.message || "Failed to load submissions");
        setRows(data.submissions || []);
      } catch (err) {
        setMsg(err.response?.data?.message || err.message || "Error loading submissions");
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId]);

  if (loading) return <p className="text-sm text-gray-500">Loading…</p>;
  if (msg) return <p className="text-sm text-red-600">{msg}</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2 pr-4">Student</th>
            
            <th className="py-2 pr-4">Assignment</th>
            <th className="py-2 pr-4">Submitted At</th>
            <th className="py-2 pr-4">PDF</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={`${r.assignmentId}-${r.studentId}`} className="border-b">
              <td className="py-2 pr-4">{r.studentName}</td>
              
              <td className="py-2 pr-4">{r.assignmentTitle}</td>
              <td className="py-2 pr-4">
                {r.submittedAt ? new Date(r.submittedAt).toLocaleString() : "—"}
              </td>
              <td className="py-2 pr-4">
                {r.pdfUrl ? (
                  <a
                    href={r.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    View PDF
                  </a>
                ) : (
                  <span className="text-gray-400">No PDF</span>
                )}
              </td>
            </tr>
          ))}

          {!rows.length && (
            <tr>
              <td colSpan="5" className="py-6 text-gray-500 text-center">
                No submissions yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
