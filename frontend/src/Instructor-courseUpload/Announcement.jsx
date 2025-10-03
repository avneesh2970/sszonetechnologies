import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const InsAnnouncement = ({ courseId }) => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required!");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/insAnnouncement`,
        { title, courseId }
      );

      if (res.data.success) {
        toast.success("Announcement added successfully!");
        setTitle(""); // clear input
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to add announcement."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">Add Announcement</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter announcement title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-400"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Saving..." : "Add Announcement"}
        </button>
      </form>
    </div>
  );
};

export default InsAnnouncement;
