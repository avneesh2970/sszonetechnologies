import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"

const EditCourseOverview = ({ courseId }) => {
  const [formData, setFormData] = useState({
    description: "",
    whatYouWillLearn: "",
    instructor: "",
    videoHours: "",
    courseLevel: "Beginner",
    language: "English",
    quizzes: "",
    certificate: false,
    accessOnMobileAndTV: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/courses/${courseId}/course-overview`,
        {
          overviewdescription: formData.description,
          whatYouWillLearn: formData.whatYouWillLearn,
          overviewinstructor: formData.instructor,
          videoHours: formData.videoHours,
          courseLevel: formData.courseLevel,
          overviewlanguage: formData.language,
          quizzes: formData.quizzes,
          certificate: formData.certificate,
          accessOnMobileAndTV: formData.accessOnMobileAndTV,
        }
      );

      toast.success("✅ Course overview updated successfully!");
      console.log("Updated overview:", response.data);
    } catch (error) {
      toast.error("❌ Failed to update overview");
      console.error("Error updating overview:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-4">Course Overview</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          name="description"
          rows="3"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
        />
        <textarea
          name="whatYouWillLearn"
          rows="3"
          placeholder="What Will You Learn?"
          value={formData.whatYouWillLearn}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
        />
        <input
          name="instructor"
          placeholder="Instructor"
          value={formData.instructor}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
        />
        <input
          name="videoHours"
          placeholder="Video Hours"
          type="number"
          value={formData.videoHours}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
        />
        <select
          name="courseLevel"
          value={formData.courseLevel}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
        <input
          name="language"
          placeholder="Language"
          value={formData.language}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
        />
        <input
          name="quizzes"
          placeholder="Quizzes"
          type="number"
          value={formData.quizzes}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
        />
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="certificate"
              checked={formData.certificate}
              onChange={handleChange}
            />
            Certificate
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="accessOnMobileAndTV"
              checked={formData.accessOnMobileAndTV}
              onChange={handleChange}
            />
            Access on Mobile and TV
          </label>
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Update Course
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCourseOverview;
