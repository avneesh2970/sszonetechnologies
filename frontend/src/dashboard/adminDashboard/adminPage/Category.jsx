import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';

const initialCategories = ['Design', 'Marketing', 'Web Design', 'Programming'];

const AdminCategory = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [isOpen, setIsOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim() !== '') {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
      setIsOpen(false);
    }
  };

  return (
    <div className="relative flex">
      {/* Left Side Category List */}
      <div className="w-full md:w-1/2 p-6">
        <h2 className="text-lg font-semibold mb-4">Category</h2>
        <div className="space-y-3">
          {categories.map((cat, idx) => (
            <input
              key={idx}
              type="text"
              readOnly
              value={cat}
              className="w-full border rounded px-4 py-2 text-sm bg-gray-50"
            />
          ))}
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="mt-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
        >
          + Add Category
        </button>
      </div>

      {/* Right Side Modal */}
      {isOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div className="w-full max-w-md bg-white p-6 shadow-lg rounded-md relative">
      {/* Close button */}
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-4 right-4 text-gray-600 hover:text-black"
      >
        <IoClose size={24} />
      </button>

      <h3 className="text-xl font-semibold mb-6">Add New Category</h3>

      <label className="block text-sm text-gray-600 mb-2">Category Name</label>
      <input
        type="text"
        placeholder="Write Category name"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        className="w-full border rounded px-4 py-2 mb-6"
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setIsOpen(false)}
          className="px-4 py-2 text-sm border rounded text-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={handleAddCategory}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Upload Category
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default AdminCategory;
