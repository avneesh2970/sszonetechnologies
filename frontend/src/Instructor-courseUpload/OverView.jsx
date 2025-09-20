
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EditCourseOverview = ({ courseId }) => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    overviewDescription: "",
    whatYouWillLearn: "",
    overviewInstructor: "",
    videoHours: "",
    courseLevel: "Beginner",
    overviewLanguage: "English Hindi",
    quizzes: 0,
    certificate: false,
    accessOnMobileAndTV: true,
    courseId: courseId || "", // ✅ courseId passed as prop
  });

  // ✅ If prop changes, sync it with state
  useEffect(() => {
    if (courseId) {
      setForm((prev) => ({ ...prev, courseId }));
    }
  }, [courseId]);

  // handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.courseId) {
      toast.error("Course ID is missing. Cannot save overview!");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/overview/create`,
        form
      );
      toast.success(res.data.message || "Overview created successfully!");

      // Reset but keep courseId
      setForm({
        overviewDescription: "",
        whatYouWillLearn: "",
        overviewInstructor: "",
        videoHours: "",
        courseLevel: "Beginner",
        overviewLanguage: "English , Hindi",
        quizzes: 0,
        certificate: false,
        accessOnMobileAndTV: true,
        courseId: form.courseId,
      });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error creating overview");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-xl space-y-6 border border-gray-200">
      <h2 className="text-2xl font-bold mb-4">Add Course Overview</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Course ID (hidden input) */}
        <input type="hidden" name="courseId" value={form.courseId} />
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 ">Overview Description</label>
          <textarea
            name="overviewDescription"
            placeholder="Enter course overview description"
            value={form.overviewDescription}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 ">What You Will Learn</label>
          <textarea
            name="whatYouWillLearn"
            placeholder="List what students will learn"
            value={form.whatYouWillLearn}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 ">Instructor</label>
          <input
            type="text"
            name="overviewInstructor"
            placeholder="Instructor Name"
            value={form.overviewInstructor}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 ">Video Hours</label>
          <input
            type="number"
            name="videoHours"
            placeholder="Total Hours"
            value={form.videoHours}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 ">Course Level</label>
          <select
            name="courseLevel"
            value={form.courseLevel}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 ">Language</label>
          <input
            type="text"
            name="overviewLanguage"
            placeholder="Language (e.g. English)"
            value={form.overviewLanguage}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 ">Quizzes</label>
          <input
            type="number"
            name="quizzes"
            placeholder="Number of quizzes"
            value={form.quizzes}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>{" "}

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="certificate"
            checked={form.certificate}
            onChange={handleChange}
          />
          <span>Certificate Available</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="accessOnMobileAndTV"
            checked={form.accessOnMobileAndTV}
            onChange={handleChange}
          />
          <span>Access on Mobile & TV</span>
        </label>

        <div className="text-end">
          <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 ml-2  rounded hover:bg-blue-700"
        >
          Save Overview
        </button> <br/>
        
        </div>
      </form>
      
    </div>
  );
};

export default EditCourseOverview;
