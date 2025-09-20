import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdCancel } from "react-icons/md";


const EditCourseModal = ({ course, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    title: course.title || "",
    slug: course.slug || "",
    description: course.description || "",
    regularPrice: course.regularPrice || "",
    discountPrice: course.discountPrice || "",
    categories: JSON.stringify(course.categories || []),
    thumbnail: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      for (let key in formData) {
        data.append(key, formData[key]);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/courses/update/${course._id}`,
        data
      );

      toast.success("✅ Course updated!");
      onUpdated(response.data); // pass updated course to parent
      //   onClose(); // close modal
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update course");
    }
  };

  //   Addition Update
  const [additionalformData, setAdditionalFormData] = useState({
    language: course.language || "",
    startDate: course.startDate || "",
    requirements: course.requirements || "",
    description: course.description || "",
    durationHour: course.durationHour || "",
    durationMinute: course.durationMinute || "",
    tags: JSON.stringify(course.tags || []),
  });

  const additionalhandleChange = (e) => {
    const { name, value } = e.target;
    setAdditionalFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const additionalhandleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/courses/${course._id}/additional-info`,
        additionalformData
      );
      console.log("Updated:", response.data);
      toast.success("✅ Additional Info Updated!");
    } catch (err) {
      console.error("Error:", err);
      toast.error("❌ Failed to update");
    }
  };

  //   Overview Update
  const [overviewData, setOverviewData] = useState({
    overviewdescription: course.overviewdescription || "",
    whatYouWillLearn: course.whatYouWillLearn || "",
    overviewinstructor: course.overviewinstructor || "",
    videoHours: course.videoHours || "",
    courseLevel: course.courseLevel || "",
    overviewlanguage: course.overviewlanguage || "",
    quizzes: course.quizzes || false,
    certificate: course.certificate || false,
    accessOnMobileAndTV: course.accessOnMobileAndTV || false,
  });

  const overviewhandleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOverviewData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const overviewhandleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/courses/${course._id}/course-overview`,
        overviewData
      );
      toast.success("✅ Course Overview Updated!");
      console.log(res.data);
    } catch (err) {
      console.error("❌ Error updating overview:", err);
      toast.error("Failed to update overview");
    }
  };

  //   for vedio

  const [videoUrl, setVideoUrl] = useState(course.videoUrl || "");

  const vdohandleSubmit = async (e) => {
    e.preventDefault();

    if (!videoUrl.trim()) {
      alert("❌ Video URL should not be empty.");
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/courses/${course._id}/upload-video`,
        { videoUrl }
      );
      alert("✅ Video URL uploaded successfully!");
      console.log("Uploaded:", response.data);
    } catch (err) {
      console.error("Upload Error:", err);
      alert("❌ Failed to upload video URL.");
    }
  };

  return (
    <>
      <div className="fixed inset-0  bg-gray-300  flex justify-center flex-wrap gap-10 items-center  overflow-y-scroll z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-lg space-y-4 relative mt-4">
          <div className="flex justify-end mt-4 sticky top-4 ">
            <button
              type="button"
              onClick={onClose}
              className=""
            >
              ❌
            </button>
          </div>
          <h2 className="text-xl font-bold text-gray-800">📝 Edit Course</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block mb-1 font-medium text-gray-700"
              >
                Course Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Slug */}
            <div>
              <label
                htmlFor="slug"
                className="block mb-1 font-medium text-gray-700"
              >
                Slug
              </label>
              <input
                id="slug"
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="Slug"
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block mb-1 font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Regular Price */}
            <div>
              <label
                htmlFor="regularPrice"
                className="block mb-1 font-medium text-gray-700"
              >
                Regular Price
              </label>
              <input
                id="regularPrice"
                type="number"
                name="regularPrice"
                value={formData.regularPrice}
                onChange={handleChange}
                placeholder="Regular Price"
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Discount Price */}
            <div>
              <label
                htmlFor="discountPrice"
                className="block mb-1 font-medium text-gray-700"
              >
                Discount Price
              </label>
              <input
                id="discountPrice"
                type="number"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                placeholder="Discount Price"
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Categories */}
            <div>
              <label
                htmlFor="categories"
                className="block mb-1 font-medium text-gray-700"
              >
                Categories{" "}
                <span className="text-sm text-gray-500">
                  (as JSON e.g. ["Web","React"])
                </span>
              </label>
              <input
                id="categories"
                type="text"
                name="categories"
                value={formData.categories}
                onChange={handleChange}
                placeholder='Categories as JSON (e.g. ["Web","React"])'
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Thumbnail Upload */}
            <div className="border-2 border-dashed p-6 text-center rounded-md">
              <label
                htmlFor="thumbnail"
                className="block mb-2 font-medium text-gray-700"
              >
                Upload Thumbnail
              </label>
              <input
                id="thumbnail"
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

            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Update Course
              </button>
              {/* <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button> */}
            </div>
          </form>

          <h2 className="text-xl font-bold text-gray-800">
            📝 Edit Additional Information
          </h2>
          <form
            onSubmit={additionalhandleSubmit}
            className="  bg-white  space-y-4"
          >
            {/* Language */}
            <div>
              <label className="block font-medium mb-1">Language</label>
              <input
                type="text"
                name="language"
                value={additionalformData.language}
                onChange={additionalhandleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block font-medium mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={additionalformData.startDate}
                onChange={additionalhandleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block font-medium mb-1">Requirements</label>
              <input
                type="text"
                name="requirements"
                value={additionalformData.requirements}
                onChange={additionalhandleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={additionalformData.description}
                onChange={additionalhandleChange}
                className="w-full border p-2 rounded"
                rows={4}
              />
            </div>

            {/* Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">
                  Duration (Hours)
                </label>
                <input
                  type="number"
                  name="durationHour"
                  value={additionalformData.durationHour}
                  onChange={additionalhandleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  name="durationMinute"
                  value={additionalformData.durationMinute}
                  onChange={additionalhandleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block font-medium mb-1">
                Tags (JSON format)
              </label>
              <input
                type="text"
                name="tags"
                value={additionalformData.tags}
                onChange={additionalhandleChange}
                className="w-full border p-2 rounded"
                placeholder='Example: ["javascript", "mern"]'
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Update Info
            </button>
          </form>

          <form onSubmit={overviewhandleSubmit} className=" space-y-4 mt-8">
            <h2 className="text-xl font-bold text-gray-700">
              📘 Update Course Overview
            </h2>

            {/* Overview Description */}
            <div>
              <label className="block font-medium mb-1">
                Overview Description
              </label>
              <textarea
                name="overviewdescription"
                value={overviewData.overviewdescription}
                onChange={overviewhandleChange}
                rows={4}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* What You Will Learn */}
            <div>
              <label className="block font-medium mb-1">
                What You Will Learn
              </label>
              <textarea
                name="whatYouWillLearn"
                value={overviewData.whatYouWillLearn}
                onChange={overviewhandleChange}
                rows={3}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Instructor Name */}
            <div>
              <label className="block font-medium mb-1">Instructor Name</label>
              <input
                type="text"
                name="overviewinstructor"
                value={overviewData.overviewinstructor}
                onChange={overviewhandleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Video Hours */}
            <div>
              <label className="block font-medium mb-1">
                Total Video Hours
              </label>
              <input
                type="text"
                name="videoHours"
                value={overviewData.videoHours}
                onChange={overviewhandleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Course Level */}
            <div>
              <label className="block font-medium mb-1">Course Level</label>
              {/* <input
          type="text"
          name="courseLevel"
          value={overviewData.courseLevel}
          onChange={overviewhandleChange}
          className="w-full border p-2 rounded"
          placeholder="Beginner / Intermediate / Expert"
        /> */}
              <select
                name="courseLevel"
                value={overviewData.courseLevel}
                onChange={overviewhandleChange}
                className="w-full border p-2 rounded-md"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block font-medium mb-1">
                Overview Language
              </label>
              <input
                type="text"
                name="overviewlanguage"
                value={overviewData.overviewlanguage}
                onChange={overviewhandleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="quizzes"
                checked={overviewData.quizzes}
                onChange={overviewhandleChange}
              />
              Includes Quizzes
            </label> */}

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="certificate"
                  checked={overviewData.certificate}
                  onChange={overviewhandleChange}
                />
                Certificate Provided
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="accessOnMobileAndTV"
                  checked={overviewData.accessOnMobileAndTV}
                  onChange={overviewhandleChange}
                />
                Access on Mobile & TV
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Update Overview
            </button>
          </form>

          <form onSubmit={vdohandleSubmit} className="space-y-4 mt-8">
            <h2 className="text-xl font-bold text-gray-700">
              📹 Upload Course Video URL
            </h2>

            <div>
              <label className="block font-medium mb-1">
                Video URL (YouTube, Vimeo, etc.)
              </label>
              <input
                type="text"
                name="videoUrl"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://example.com/video"
                className="w-full border p-2 rounded"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Upload Video
            </button>
          </form>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default EditCourseModal;
