// src/components/AdminQuizModal.jsx
import React, { useEffect, useRef } from "react";
import { FaTimes, FaCheck } from "react-icons/fa";

/**
 * Compact view-only modal that shows:
 * - question text
 * - options as a compact list
 * - correct option highlighted in green
 *
 * Correct answer detection supports: correctIndex, correct, answer (number|string), correctOption
 *
 * Usage:
 * <AdminQuizModal isOpen={showModal} quiz={selectedQuiz} onClose={...} />
 */
export default function AdminQuizModal({ isOpen, quiz, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!isOpen) return;
    ref.current?.focus?.();
    const handleKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen || !quiz) return null;

  const detectCorrectIndex = (q = {}) => {
    if (typeof q.correctIndex === "number") return q.correctIndex;
    if (typeof q.correct === "number") return q.correct;
    if (typeof q.answer === "number") return q.answer;
    if (typeof q.answer === "string" && Array.isArray(q.options)) {
      const i = q.options.indexOf(q.answer);
      if (i !== -1) return i;
    }
    if (typeof q.correctOption === "string" && Array.isArray(q.options)) {
      const i = q.options.indexOf(q.correctOption);
      if (i !== -1) return i;
    }
    return null;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={ref}
        tabIndex={-1}
        className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden "
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b">
          <div>
            {quiz.title && <h3 className="text-lg font-semibold leading-tight">{quiz.title}</h3>}
            <p className="text-xs text-gray-500 mt-1">{(quiz.questions?.length ?? 0) + " question(s)"}</p>
          </div>

          <button
            onClick={onClose}
            className="ml-4 p-2 rounded hover:bg-gray-100"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Body: compact list */}
        <div className="p-3 overflow-y-auto max-h-[68vh]">
          {(!quiz.questions || quiz.questions.length === 0) && (
            <div className="text-center text-gray-500 py-6">No questions in this quiz.</div>
          )}

          {quiz.questions?.map((q, qi) => {
            const key = q._id ?? qi;
            const correctIdx = detectCorrectIndex(q);

            return (
              <div key={key} className="mb-4">
                <p className="text-sm font-medium mb-2">
                  <span className="font-semibold mr-2">{qi + 1}.</span>
                  <span className="leading-tight">{q.question}</span>
                </p>

                <ul className="space-y-1">
                  {Array.isArray(q.options) &&
                    q.options.map((opt, oi) => {
                      const isCorrect = correctIdx === oi;
                      return (
                        <li
                          key={oi}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                            isCorrect
                              ? "bg-green-50 border border-green-100 text-green-800"
                              : "bg-white border border-transparent hover:bg-gray-50"
                          }`}
                        >
                          <span className="w-5 text-xs text-gray-500">{String.fromCharCode(65 + oi)}.</span>
                          <span className={`${isCorrect ? "font-semibold" : ""}`}>{opt}</span>
                          {isCorrect && <FaCheck className="ml-auto text-green-600" />}
                        </li>
                      );
                    })}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded border text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
