import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdditionalInfoForm = ({ courseId }) => {
  const [form, setForm] = useState({
    language: "",
    startDate: "",
    requirements: "",
    description: "",
    durationHour: "",
    durationMinute: "",
    tags: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const {
      language,
      startDate,
      requirements,
      description,
      durationHour,
      durationMinute,
      tags,
    } = form;

    if (
      !language ||
      !startDate ||
      !requirements ||
      !description ||
      !durationHour ||
      !durationMinute ||
      !tags
    ) {
      toast.error("❌ Please fill out all fields.");
      return false;
    }

    if (Number(durationHour) < 0 || Number(durationMinute) < 0) {
      toast.error("❌ Duration values must be non-negative.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/instructor-courses/${courseId}/additional-info`,
        {
          language: form.language,
          startDate: form.startDate,
          requirements: form.requirements,
          description: form.description,
          duration: {
            hour: Number(form.durationHour),
            minute: Number(form.durationMinute),
          },
          tags: form.tags.split(",").map((tag) => tag.trim()),
        },
        { withCredentials: true }
      );

      toast.success("Additional Info added!");
      console.log("UPdated Course " , res.data.course);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add info");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg mt-10 max-w-3xl mx-auto space-y-6 border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-gray-800">
          📘 Additional Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <input
              name="language"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
              placeholder="Language"
              onChange={handleChange}
              value={form.language}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              name="startDate"
              type="date"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
              value={form.startDate}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Requirements
          </label>
          <textarea
            name="requirements"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            placeholder="Requirements"
            onChange={handleChange}
            value={form.requirements}
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Description
          </label>
          <textarea
            name="description"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            placeholder="Course Description"
            onChange={handleChange}
            value={form.description}
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (Hours)
            </label>
            <input
              name="durationHour"
              type="number"
              placeholder="e.g. 3"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
              value={form.durationHour}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (Minutes)
            </label>
            <input
              name="durationMinute"
              type="number"
              placeholder="e.g. 30"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
              value={form.durationMinute}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <input
            name="tags"
            placeholder="e.g. JavaScript, React, Web Development"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
            value={form.tags}
          />
          <p className="text-xs text-gray-500 mt-1">
            Comma separated (e.g. frontend, js, UI)
          </p>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Save Additional Info
          </button>
        </div>
      </form>

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default AdditionalInfoForm;
