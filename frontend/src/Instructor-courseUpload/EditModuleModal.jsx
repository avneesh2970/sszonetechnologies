import { useState } from "react";
import axios from "axios";

const EditModuleModal = ({ module, onClose, onUpdate }) => {
  const [title, setTitle] = useState(module.title);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/course-structuremodule/${module._id}`,
        { title }
      );
      onUpdate(res.data.data); // update parent state
    } catch (error) {
      console.error("Error updating module:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Edit Module</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            required
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModuleModal;
