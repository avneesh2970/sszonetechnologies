
import React, { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import LessonEditModal from "./LessonEdit";

const ModuleList = ({ modules }) => {
  const [editingLesson, setEditingLesson] = useState(null);
  const [localModules, setLocalModules] = useState(modules);

  // Sync initial modules prop
  useEffect(() => {
    setLocalModules(modules);
  }, [modules]);

  const handleEditClick = (lesson) => {
    setEditingLesson(lesson);
  };

  const handleLessonUpdate = (updatedLesson) => {
    const updatedModules = localModules.map((mod) => {
      return {
        ...mod,
        lessons: mod.lessons.map((lesson) =>
          lesson._id === updatedLesson._id ? updatedLesson : lesson
        ),
      };
    });

    setLocalModules(updatedModules);
    setEditingLesson(null); // close modal
  };

  return (
    <div className="max-w-3xl mx-auto p-8 mt-4 bg-white shadow-xl rounded-xl space-y-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        📘 All Modules & Lessons
      </h2>

      {localModules.length === 0 && (
        <p className="text-gray-500">No modules added yet.</p>
      )}

      {localModules.map((mod, index) => (
        <div
          key={mod._id}
          className="mb-6 border border-gray-200 p-6 rounded-xl bg-white shadow-sm"
        >
          <h3 className="font-semibold text-lg text-blue-700 mb-3">
            Module {index + 1}: {mod.title}
          </h3>

          {mod.lessons && mod.lessons.length > 0 ? (
            <ul className="space-y-2">
              {mod.lessons.map((lesson, idx) => (
                <li
                  key={lesson._id}
                  className="border-b last:border-0 pb-2 text-sm text-gray-700 flex justify-between items-center"
                >
                  <div>
                    <span className="font-medium">
                      {idx + 1}. {lesson.lessonTitle}
                    </span>{" "}
                    <span className="text-gray-500">– {lesson.lessonContent}</span>
                  </div>

                  <button
                    onClick={() => handleEditClick(lesson)}
                    className="text-blue-500 hover:text-blue-700 flex items-center space-x-1"
                  >
                    <FiEdit />
                    <span>Edit</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 italic">
              No lessons in this module yet.
            </p>
          )}
        </div>
      ))}

      {editingLesson && (
        <LessonEditModal
          lesson={editingLesson}
          onClose={() => setEditingLesson(null)}
          onLessonUpdated={handleLessonUpdate}
        />
      )}
    </div>
  );
};

export default ModuleList;
