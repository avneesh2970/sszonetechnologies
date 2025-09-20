import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const UpdateModule = ({ moduleData, onSuccess, onClose }) => {
  const [moduleForm, setModuleForm] = useState({ title: "" });

  // Prefill form when moduleData changes
  useEffect(() => {
    if (moduleData) {
      setModuleForm({ title: moduleData.title });
    }
  }, [moduleData]);

  // Handle input change
  const handleChangeModule = (e) => {
    setModuleForm({ ...moduleForm, [e.target.name]: e.target.value });
  };

  // Handle submit
  const handleSubmitModule = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/course-structure/module/${moduleData._id}`,
        moduleForm
      );
      toast.success("✅ Module updated!");
      if (onSuccess) onSuccess(res.data.module);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to update module");
    }
  };

  return (
    <form
      onSubmit={handleSubmitModule}
      className="bg-white p-6 rounded-2xl shadow-md max-w-md mx-auto"
    >
      <h2 className="text-xl font-bold mb-4">Update Module</h2>

      <input
        type="text"
        name="title"
        value={moduleForm.title}
        onChange={handleChangeModule}
        className="w-full border rounded p-2 mb-4"
        placeholder="Module Title"
      />

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update
        </button>
      </div>
    </form>
  );
};

export default UpdateModule;
