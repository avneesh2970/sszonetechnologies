// src/components/QuizModal.jsx
import React, { useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";

/**
 * Props:
 * - isOpen: boolean
 * - quiz: { _id?, title, questions: [{ _id?, question, options: [] }, ...] } | null
 * - onClose: ()=>void
 * - answers: array (indices or null)
 * - setAnswers: (fn) => void
 * - onSubmit: ()=>Promise<void> (or void)
 * - loading: boolean
 * - result: object | null
 */
export default function QuizModal({
  isOpen,
  quiz,
  onClose,
  answers = [],
  setAnswers = () => {},
  onSubmit = () => {},
  loading = false,
  result = null,
}) {
  const modalRef = useRef(null);
  const lastFocused = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    lastFocused.current = document.activeElement;
    setTimeout(() => modalRef.current?.focus?.(), 10);

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      try {
        lastFocused.current?.focus?.();
      } catch {}
    };
  }, [isOpen, onClose]);

  if (!isOpen || !quiz) return null;

  // safer setter using functional update to avoid stale state
  const handleAnswer = (qIndex, optionIndex) => {
    setAnswers((prev = []) => {
      const copy = Array.isArray(prev) ? [...prev] : [];
      // ensure array length
      if (copy.length < (quiz.questions?.length || 0)) {
        copy.length = quiz.questions.length;
        for (let i = 0; i < copy.length; i++)
          if (copy[i] === undefined) copy[i] = null;
      }
      copy[qIndex] = optionIndex;
      // console.log("setAnswers ->", copy); // uncomment for debugging
      return copy;
    });
  };

  const allAnswered =
    Array.isArray(answers) &&
    answers.length === (quiz.questions?.length || 0) &&
    !answers.some((a) => a === null || a === undefined);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-modal-title"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="bg-white rounded-lg shadow-lg w-full max-w-3xl mt-10 relative outline-none"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 id="quiz-modal-title" className="text-lg font-semibold">
              {quiz.title}
            </h3>
            <p className="text-sm text-gray-500">
              {quiz.questions?.length || 0} question(s)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {quiz.questions?.map((ques, qi) => {
            const qKey = ques._id ?? qi;
            // per-question group name (must be identical for options of same question,
            // but unique across different questions)
            const groupName = `quiz-${quiz._id ?? "noid"}-q-${qKey}`;

            return (
              <div key={qKey} className="mb-4 p-3 border rounded">
                <p className="font-semibold">
                  {qi + 1}. {ques.question}
                </p>

                <div className="mt-2 space-y-2">
                  {ques.options?.map((opt, oi) => {
                    const inputId = `r-${quiz._id ?? "q"}-${qKey}-opt-${oi}`;
                    return (
                      // keep label as wrapper, but also handle clicks explicitly
                      <label
                        key={oi}
                        htmlFor={inputId}
                        className="block cursor-pointer"
                        onClick={() => {
                          // ensure clicking the label triggers the same handler (helps if some CSS blocks the native input click)
                          handleAnswer(qi, oi);
                        }}
                      >
                        <input
                          id={inputId}
                          type="radio"
                          name={groupName}
                          value={oi} // numeric-ish value (string in DOM but easier to parse)
                          checked={
                            Array.isArray(answers) ? answers[qi] === oi : false
                          }
                          onChange={(e) => {
                            // prefer reading from event for reliability
                            const val = Number(e.target.value);
                            // console.log("radio onChange", qi, val);
                            handleAnswer(qi, val);
                          }}
                          className="mr-2"
                        />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t flex items-center gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded border">
            Close
          </button>
          <button
            onClick={onSubmit}
            disabled={loading || !allAnswered}
            className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50"
            aria-disabled={loading || !allAnswered}
            title={!allAnswered ? "Please answer all questions" : "Submit quiz"}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>

        {result && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h4 className="text-lg font-semibold mb-2 text-center">Result</h4>
              <p className="text-center mb-3 font-medium">
                Score: {result.score} / {result.total}
              </p>

              <div className="max-h-48 overflow-y-auto mb-4">
                {Array.isArray(result.results) && result.results.length > 0 ? (
                  result.results.map((r, i) => (
                    <p
                      key={i}
                      className={
                        r.isCorrect ? "text-green-600" : "text-red-600"
                      }
                    >
                      Q{i + 1}: {r.isCorrect ? "Correct" : "Wrong"}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No detailed results available.
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="w-full bg-blue-600 text-white py-2 rounded"
                >
                  Back to List
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
