<div className="px-6 md:px-12 my-6">
            <h2 className="text-lg font-bold mb-4">Course Modules</h2>

            <p className="text-md font-medium mt-2 text-gray-400">
              Total Lessons:{" "}
              {course.modules?.reduce(
                (sum, module) => sum + (module.lessons?.length || 0),
                0
              ) || 0}
            </p>

            {course.modules?.length > 0 ? (
              course.modules.map((module, midx) => (
                <div
                  key={module._id}
                  className="mb-6 border border-gray-200 p-4 rounded"
                >
                  <h2 className=" font-bold text-md mb-3">
                    Module {midx + 1}: {module.title}
                  </h2>

                  <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                    {module.lessons?.length > 0 ? (
                      module.lessons.map((lesson, lidx) => (
                        <li key={lesson._id}>
                          {/* Use merged LessonItem component */}
                          <LessonItem
                            lesson={lesson}
                            isOpen={openLessonId === lesson._id}
                            onToggle={() => handleLessonToggle(lesson)}
                          />
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-400 italic">
                        No lessons in this module.
                      </li>
                    )}
                  </ul>

                  <div className="mt-4">
                    <h4 className=" font-medium">Quizzes:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                      {module.quizzes?.length > 0 ? (
                        module.quizzes.map((quiz) => (
                          <li
                            key={quiz._id}
                            className="flex justify-between cursor-pointer hover:underline hover:text-blue-500"
                            onClick={() => startQuiz(quiz._id)}
                          >
                            {quiz.title} <span>Attempt Quiz</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-400 italic">
                          No Quiz in this module.
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="mt-4">
                    <h4 className=" font-medium ">Assignments:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                      {module.assignments?.length > 0 ? (
                        module.assignments.map((assignment) => (
                          <li
                            key={assignment._id}
                            className="flex justify-between cursor-pointer hover:underline hover:text-blue-500"
                            onClick={() => setSelectedAssignment(assignment)}
                          >
                            {assignment.title} <span>full-details</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-400 italic">
                          No assignments in this module.
                        </li>
                      )}
                    </ul>

                    {/* 🔹 Modal */}
                    {selectedAssignment && (
                      <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                          {/* Close */}
                          <button
                            onClick={() => {
                              setSelectedAssignment(null);
                              setSubStatus(null);
                              setFile(null);
                              setMsg("");
                            }}
                            className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl"
                          >
                            ✖
                          </button>

                          {/* Assignment Info */}
                          <h2 className="text-xl font-bold mb-2">
                            {selectedAssignment.title}
                          </h2>
                          <p className="text-gray-700 mb-4">
                            {selectedAssignment.summary}
                          </p>

                          <h3 className="font-semibold mb-2">Questions:</h3>
                          <ul className="list-decimal pl-5 space-y-2 text-gray-600">
                            {selectedAssignment.questions?.map((q, index) => (
                              <li key={index}>{q.questionText || q}</li>
                            ))}
                          </ul>

                          <div className="border-t my-4" />

                          {/* 🔹 Status */}
                          <div className="mb-3">
                            <h4 className="font-semibold">Your submission</h4>
                            {statusLoading ? (
                              <p className="text-sm text-gray-500 mt-1">
                                Loading status…
                              </p>
                            ) : subStatus ? (
                              <div className="text-sm mt-1 space-y-1">
                                <p>
                                  Status:{" "}
                                  <span
                                    className={
                                      subStatus.status === "completed"
                                        ? "text-green-600 font-medium"
                                        : "text-yellow-700 font-medium"
                                    }
                                  >
                                    {subStatus.status || "pending"}
                                  </span>
                                </p>
                                {subStatus.submittedAt && (
                                  <p className="text-gray-600">
                                    Submitted:{" "}
                                    {new Date(
                                      subStatus.submittedAt
                                    ).toLocaleString()}
                                  </p>
                                )}
                                {subStatus.pdfUrl && (
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <p className="font-medium text-slate-700">
                                      PDF:
                                    </p>
                                    <div className="flex gap-3">
                                      <a
                                        href={subStatus.pdfUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 underline"
                                      >
                                        View
                                      </a>
                                      <a
                                        href={subStatus.pdfUrl}
                                        download
                                        className="text-green-600 underline"
                                      >
                                        Download
                                      </a>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 mt-1">
                                No submission yet (pending).
                              </p>
                            )}
                          </div>

                          {/* 🔹 Upload Form */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium">
                              Upload PDF
                            </label>
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={onFileChange}
                              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {file && (
                              <p className="text-xs text-gray-500">
                                Selected: {file.name} (
                                {(file.size / (1024 * 1024)).toFixed(2)} MB)
                              </p>
                            )}

                            {msg && (
                              <p
                                className={`text-sm ${
                                  msg.startsWith("✅")
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {msg}
                              </p>
                            )}

                            <div className="flex items-center gap-2 pt-2">
                              <button
                                disabled={uploading || !file}
                                onClick={onSubmit}
                                className={`px-4 py-2 rounded-md text-white ${
                                  uploading || !file
                                    ? "bg-blue-300 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                                }`}
                              >
                                {uploading
                                  ? "Submitting…"
                                  : subStatus?.status === "completed"
                                  ? "Re-submit PDF"
                                  : "Submit PDF"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No modules found for this course.</p>
            )}
          </div>  

