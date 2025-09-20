import React, { useEffect, useState } from "react";
import { FaX } from "react-icons/fa6";
import { toast } from "react-toastify";
import axios from "axios";

const InstructorAnnouncement = () => {
  const [open, setOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);

  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch announcements from backend
  const getAnnouncement = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/ancument/getannouncement`
      );
      setAnnouncements(response.data);
    } catch (error) {
      toast.error("Failed to fetch announcements.");
    }
  };

  useEffect(() => {
    getAnnouncement();
  }, []);

  // Add new announcement
  const handleAddAnnouncement = async (e) => {
    e.preventDefault();

    if (!title || !course || !date || !time) {
      return toast.error("Please fill in all fields.");
    }

    const formData = { title, course, date, time };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/ancument/announcement`,
        formData
      );

      toast.success("Announcement added successfully!");
      setAnnouncements((prev) => [response.data, ...prev]);

      clearForm();
    } catch (error) {
      toast.error("Failed to add announcement.");
    }
  };

  // Update announcement
  const handleUpdateAnnouncement = async (e) => {
    e.preventDefault();

    if (!title || !course || !date || !time) {
      return toast.error("Please fill in all fields.");
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/ancument/announcement/${editId}`,
        { title, course, date, time }
      );

      toast.success("Announcement updated successfully!");
      const updatedList = announcements.map((item) =>
        item._id === editId ? response.data : item
      );
      setAnnouncements(updatedList);

      clearForm();
      setIsEditing(false);
      setEditId(null);
      setOpen(false);
    } catch (error) {
      toast.error("Failed to update announcement.");
    }
  };

  // Delete announcement
  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/ancument/announcement/${id}`);
      setAnnouncements((prev) => prev.filter((item) => item._id !== id));
      toast.success("Announcement deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete announcement.");
    }
  };

  // Prepare form for editing announcement
  const handleEdit = (announcement) => {
    setTitle(announcement.title);
    setCourse(announcement.course);
    setDate(announcement.date);
    setTime(announcement.time);
    setEditId(announcement._id);
    setIsEditing(true);
    setOpen(true);
  };

  // Clear form fields
  const clearForm = () => {
    setTitle("");
    setCourse("");
    setDate("");
    setTime("");
  };

  return (
    <div className="p-6 relative">
      <h1 className="text-2xl font-semibold mb-4">Announcement</h1>

      <div className="bg-blue-100 p-6 rounded-lg mb-6 flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold">Notify all your students.</p>
          <p className="text-sm text-gray-700">Create Announcement</p>
        </div>
        <button
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => {
            clearForm();
            setIsEditing(false);
            setEditId(null);
            setOpen(true);
          }}
        >
          Add New Announcement
        </button>
      </div>

      <div className="bg-blue-50 rounded-lg overflow-hidden">
        <div className="grid grid-cols-3 font-semibold text-gray-700 border-b p-4">
          <div>Date</div>
          <div>Announcements</div>
          <div>Status</div>
        </div>

        {announcements.length === 0 && (
          <div className="p-4 text-center text-gray-600">No announcements found.</div>
        )}

        {announcements.map((item, idx) => (
          <div
            key={item._id || idx}
            className="grid grid-cols-3 items-start text-sm text-gray-800 border-b px-4 py-3"
          >
            <div>
              <p>{item.date}</p>
              <p className="text-gray-500 text-xs">{item.time}</p>
            </div>
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-gray-500 text-xs">Course: {item.course}</p>
            </div>
            <div>
              <button
                className="text-blue-600 hover:underline mr-4"
                onClick={() => handleEdit(item)}
              >
                Update
              </button>
              <button
                className="text-red-500 hover:underline"
                onClick={() => handleDeleteAnnouncement(item._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[600px] p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-red-600"
              onClick={() => {
                setOpen(false);
                clearForm();
                setIsEditing(false);
                setEditId(null);
              }}
            >
              <FaX className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? "Update Announcement" : "New Announcement"}
            </h2>

            <form className="grid grid-cols-1 gap-4" onSubmit={isEditing ? handleUpdateAnnouncement : handleAddAnnouncement}>
              <input
                type="text"
                placeholder="Title"
                className="border p-2 rounded"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="Course"
                className="border p-2 rounded"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
              />
              <input
                type="date"
                className="border p-2 rounded"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <input
                type="time"
                className="border p-2 rounded"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                {isEditing ? "Update" : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorAnnouncement;
