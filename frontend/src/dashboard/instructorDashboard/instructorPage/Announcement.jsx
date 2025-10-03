import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAuth from "./hooks/useAuth";
import axios from "axios";

const InstructorAnnouncement = () => {
  const { courses, fetchInstructorCourses } = useAuth();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAnn, setSelectedAnn] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    fetchInstructorCourses();
  }, []);

  // ✅ Open Edit Modal
  const handleEdit = (ann) => {
    setSelectedAnn(ann);
    setEditTitle(ann.title);
    setShowEditModal(true);
  };

  // ✅ Submit Edit
  const submitEdit = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/insAnnouncement/${selectedAnn._id}`,
        { title: editTitle }
      );
      toast.success("Announcement updated");
      fetchInstructorCourses();
      setShowEditModal(false);
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  // ✅ Open Delete Modal
  const handleDelete = (ann) => {
    setSelectedAnn(ann);
    setShowDeleteModal(true);
  };

  // ✅ Confirm Delete
  const confirmDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/insAnnouncement/${selectedAnn._id}`
      );
      toast.success("Announcement deleted");
      fetchInstructorCourses();
      setShowDeleteModal(false);
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="sm:p-6">
      <h2 className="text-xl font-semibold mb-4">Announcement</h2>

      {/* ✅ Announcement Table */}
      <div className="overflow-hidden border border-gray-300 rounded-lg">
        <table className="min-w-full border-collapse">
          <thead className="bg-blue-100 text-gray-700 font-semibold">
            <tr>
              <th className="border border-gray-300 px-4 py-3 text-left">Date</th>
              <th className="border border-gray-300 px-4 py-3 text-left">Announcements</th>
              <th className="border border-gray-300 px-4 py-3 text-left">Course</th>
              <th className="border border-gray-300 px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {courses?.map((course) =>
              course.announcement?.map((ann, idx) => (
                <tr
                  key={ann._id || idx}
                  className="hover:bg-blue-50 transition"
                >
                  <td className="border- border-gray-300 px-4 py-3">
                    {new Date(ann.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 font-medium">
                    {ann.title}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-500 ">
                    {course.title}
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    <button
                      className="text-blue-600 hover:underline mr-4"
                      onClick={() => handleEdit(ann)}
                    >
                      Update
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDelete(ann)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Announcement</h2>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={submitEdit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Delete Announcement</h2>
            <p className="mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">"{selectedAnn?.title}"</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorAnnouncement;
