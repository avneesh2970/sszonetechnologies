import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CourseForm = ({ onCourseCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    regularPrice: "",
    discountPrice: "",
    categories: "Beginner",
    thumbnail: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "thumbnail") {
      setFormData({ ...formData, thumbnail: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const {
      title,
      slug,
      description,
      regularPrice,
      discountPrice,
      categories,
      thumbnail,
    } = formData;

    if (
      !title ||
      !slug ||
      !description ||
      !regularPrice ||
      !discountPrice ||
      !categories ||
      !thumbnail
    ) {
      toast.error("❌ Please fill in all required fields!");
      return false;
    }

    if (Number(discountPrice) >= Number(regularPrice)) {
      toast.error("❌ Discount price should be less than regular price.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/instructor-courses/create`,
        data,
        {
          withCredentials: true,
        }
      );

      toast.success("Course created. Now add Additional Info.");
      onCourseCreated(res.data.course._id); // pass courseId to parent
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create course");
      console.log("error in course creaete" , err)
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-xl space-y-6 border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-gray-800">
          📘 Create New Course
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Title
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Course Title"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug
            </label>
            <input
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="course-slug"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write about the course..."
            rows={4}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Regular Price (₹)
            </label>
            <input
              type="number"
              name="regularPrice"
              value={formData.regularPrice}
              onChange={handleChange}
              placeholder="999"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Price (₹)
            </label>
            <input
              type="number"
              name="discountPrice"
              value={formData.discountPrice}
              onChange={handleChange}
              placeholder="499"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categories 
          </label>
          
          <select
            name="categories"
            value={formData.categories}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Development">Development</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Programming">Programming</option>
            <option value="Web Design">Web Design</option>
          </select>
        </div>

        <div className="border-2 border-dashed p-6 text-center rounded-md">
          <label className="block mb-2 font-medium text-gray-700">
            Upload Thumbnail
          </label>
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleChange}
            className="text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Recommended size: 700x430px
          </p>

          {formData.thumbnail && typeof formData.thumbnail !== "string" && (
            <img
              src={URL.createObjectURL(formData.thumbnail)}
              alt="Preview"
              className="mt-4 mx-auto h-40 object-cover rounded shadow-md"
            />
          )}
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Create Course
          </button>
        </div>
      </form>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default CourseForm;
