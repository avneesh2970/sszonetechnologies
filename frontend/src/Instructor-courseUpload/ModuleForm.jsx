import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import AddQuestionsForm from "./AddQuestion";

const ManageModulesLessons = ({ courseId }) => {
  const [modules, setModules] = useState([]);
  const [moduleTitle, setModuleTitle] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [title, setTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [lessonForm, setLessonForm] = useState([
    {
      lessonTitle: "",
      lessonContent: "",
      lessonVideoSource: "",
      lessonHour: "",
      lessonMinute: "",
      lessonSecond: "",
    },
  ]);

  // Fetch existing modules for this course
  const fetchModules = async () => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/course-structure/module/${courseId}`
      );
      setModules(res.data.modules || res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  // Add a new module
  const handleAddModule = async () => {
    if (!moduleTitle) return toast.error("Module title is required");
    try {
      const res = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/course-structure/module/create`,
        {
          title: moduleTitle,
          courseId,
        }
      );
      toast.success("Module added!");
      // Directly add new module to state instead of re-fetching
      setModules((prev) => [...prev, res.data.module]);
      setModuleTitle("");
      fetchModules();
    } catch (err) {
      console.error(err);
      toast.error("Error adding module");
    }
  };

  // Lesson form handlers
  const handleLessonChange = (index, e) => {
    const newLessons = [...lessonForm];
    newLessons[index][e.target.name] = e.target.value;
    setLessonForm(newLessons);
  };

  const addLessonField = () => {
    setLessonForm([
      ...lessonForm,
      {
        lessonTitle: "",
        lessonContent: "",
        lessonVideoSource: "",
        lessonHour: "",
        lessonMinute: "",
        lessonSecond: "",
      },
    ]);
  };

  const handleAddLessons = async (e) => {
    e.preventDefault();
    if (!selectedModule) return toast.error("Select a module first");
    try {
      for (let lesson of lessonForm) {
        await axios.post(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/course-structure/lesson/create`,
          {
            ...lesson,
            moduleId: selectedModule,
          }
        );
      }
      toast.success("Lessons added!");
      setLessonForm([
        {
          lessonTitle: "",
          lessonContent: "",
          lessonVideoSource: "",
          lessonHour: "",
          lessonMinute: "",
          lessonSecond: "",
        },
      ]);
      fetchModules(); // Optional: update module info
    } catch (err) {
      console.error(err);
      toast.error("Error adding lessons");
    }
  };


  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <select
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="">-- Select Module for quiz --</option>
          {modules.map((mod) => (
            <option key={mod._id} value={mod._id}>
              {mod.title}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Quiz
        </button>
        <div>
          
          <button
            onClick={() => setIsOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Question
          </button>

          
          {isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl"
                >
                  ✖
                </button>

                
                <AddQuestionsForm courseId={courseId} />
              </div>
            </div>
          )}
        </div>
      </form> */}
      {/* Add Module */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          {" "}
           Add Module
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Module Title"
            value={moduleTitle}
            onChange={(e) => setModuleTitle(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleAddModule}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Module
          </button>
        </div>
      </div>

      {/* Add Lessons */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          📘 Add Lessons
        </h2>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Select Module</label>
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Select Module --</option>
            {modules.map((mod) => (
              <option key={mod._id} value={mod._id}>
                {mod.title}
              </option>
            ))}
          </select>
        </div>

        {lessonForm.map((lesson, idx) => (
          <div key={idx} className="space-y-2 border-b p-3 rounded mb-3">
            <input
              type="text"
              name="lessonTitle"
              placeholder="Lesson Title"
              value={lesson.lessonTitle}
              onChange={(e) => handleLessonChange(idx, e)}
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              name="lessonContent"
              placeholder="Lesson Content"
              value={lesson.lessonContent}
              onChange={(e) => handleLessonChange(idx, e)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="lessonVideoSource"
              placeholder="Lesson Video URL"
              value={lesson.lessonVideoSource}
              onChange={(e) => handleLessonChange(idx, e)}
              className="w-full p-2 border rounded"
            />

            {/* Duration */}
            <div className="flex gap-2">
              <input
                type="number"
                name="lessonHour"
                placeholder="Hours"
                value={lesson.lessonHour}
                onChange={(e) => handleLessonChange(idx, e)}
                className="w-1/3 p-2 border rounded"
              />
              <input
                type="number"
                name="lessonMinute"
                placeholder="Minutes"
                value={lesson.lessonMinute}
                onChange={(e) => handleLessonChange(idx, e)}
                className="w-1/3 p-2 border rounded"
              />
              <input
                type="number"
                name="lessonSecond"
                placeholder="Seconds"
                value={lesson.lessonSecond}
                onChange={(e) => handleLessonChange(idx, e)}
                className="w-1/3 p-2 border rounded"
              />
            </div>
          </div>
        ))}

        <div className="text-end ">
          <button
            type="button"
            onClick={addLessonField}
            className="bg-gray-200 px-3 py-2 rounded mb-4"
          >
            + Add Lesson
          </button>

          <button
            onClick={handleAddLessons}
            className="bg-blue-600 text-white px-4 py-2 ml-2 rounded hover:bg-blue-700"
          >
            Save Lessons
          </button>
        </div>
      </div>
      <ToastContainer autoClose={1000}/>
    </div>
  );
};

export default ManageModulesLessons;
