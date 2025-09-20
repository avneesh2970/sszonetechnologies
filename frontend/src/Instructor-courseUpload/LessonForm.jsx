import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const LessonForm = ({ courseId }) => {
  const [modules, setModules] = useState([]);
  const [form, setForm] = useState({
    lessonTitle: "",
    lessonContent: "",
    lessonVideoSource: "",
    lessonHour: "",
    lessonMinute: "",
    lessonSecond: "",
    moduleId: "",
  });

  // Fetch all modules of this course
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/by-course/${courseId}`);
        setModules(res.data.modules);
      } catch (err) {
        toast.error("Failed to load modules");
      }
    };
    fetchModules();
  }, [courseId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/lesson/create`, form);
      toast.success("Lesson created successfully!");
      setForm({
        lessonTitle: "",
        lessonContent: "",
        lessonVideoSource: "",
        lessonHour: "",
        lessonMinute: "",
        lessonSecond: "",
        moduleId: "",
      });
    } catch (err) {
      toast.error("Error creating lesson");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 border rounded-lg">
      <h2 className="text-lg font-semibold">Add Lesson</h2>

      {/* Lesson Title */}
      <input
        type="text"
        name="lessonTitle"
        placeholder="Lesson Title"
        value={form.lessonTitle}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      {/* Lesson Content */}
      <textarea
        name="lessonContent"
        placeholder="Lesson Content"
        value={form.lessonContent}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      {/* Video Source */}
      <input
        type="text"
        name="lessonVideoSource"
        placeholder="Lesson Video URL"
        value={form.lessonVideoSource}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      {/* Duration */}
      <div className="flex gap-2">
        <input
          type="number"
          name="lessonHour"
          placeholder="Hours"
          value={form.lessonHour}
          onChange={handleChange}
          className="w-1/3 p-2 border rounded"
        />
        <input
          type="number"
          name="lessonMinute"
          placeholder="Minutes"
          value={form.lessonMinute}
          onChange={handleChange}
          className="w-1/3 p-2 border rounded"
        />
        <input
          type="number"
          name="lessonSecond"
          placeholder="Seconds"
          value={form.lessonSecond}
          onChange={handleChange}
          className="w-1/3 p-2 border rounded"
        />
      </div>

      {/* Dropdown for Module */}
      <select
        name="moduleId"
        value={form.moduleId}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        
      >
        <option value="">Select Module</option>
        {modules.map((m) => (
          <option key={m._id} value={m._id}>
            {m.title}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Create Lesson
      </button>
    </form>
  );
};

export default LessonForm;
