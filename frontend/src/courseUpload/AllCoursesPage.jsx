import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPlayer from "react-player";
import LessonVideoPlayer from "./LassonVideoPlayer";

const AllCoursesPage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/courses/all/full`
        );
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses", err);
      }
    };
    fetchAllCourses();
  }, []);

  if (courses.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">Loading courses...</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <h1 className="text-3xl font-bold text-center">
        All Courses {courses.length}
      </h1>

      {courses.map((course) => (
        <div
          key={course._id}
          className="bg-white p-6 rounded-xl shadow space-y-6"
        >
          {/* Thumbnail & Title */}
          <div className="space-y-2">
            {course.thumbnail && (
              <img
                src={course.thumbnail}
                alt="Course thumbnail"
                className="w-full h-64 object-cover rounded"
              />
            )}
            <h2 className="text-2xl font-bold text-blue-700">{course.title}</h2>
            <p className="text-sm text-gray-400">ID: {course._id}</p>
          </div>

          {/* Course Details */}
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <p>
              <strong>Slug:</strong> {course.slug}
            </p>
            <p>
              <strong>Categories:</strong> {course.categories?.join(", ")}
            </p>
            <p>
              <strong>Price:</strong> ₹{course.discountPrice}{" "}
              <span className="line-through text-gray-400">
                ₹{course.regularPrice}
              </span>
            </p>

            <p>
              <strong>Language:</strong> {course.language}
            </p>
            <p>
              <strong>Start Date:</strong> {course.startDate}
            </p>
            <p>
              <strong>Requirements:</strong> {course.requirements}
            </p>
            <p>
              <strong>Description:</strong> {course.description}
            </p>
            <p>
              <strong>Duration:</strong> {course.durationHour}h{" "}
              {course.durationMinute}m
            </p>
            <p>
              <strong>Tags:</strong> {course.tags?.join(", ")}
            </p>
          </div>
          {/* Overview Section */}
          <div className="bg-gray-50 p-4 rounded-md space-y-2 border border-gray-200">
            <h3 className="text-lg font-semibold text-blue-700">
              📝 Course Overview
            </h3>

            <p>
              <strong>Description:</strong>{" "}
              {course.overviewdescription || "N/A"}
            </p>
            <p>
              <strong>What You'll Learn:</strong>{" "}
              {course.whatYouWillLearn || "N/A"}
            </p>
            <p>
              <strong>Instructor:</strong> {course.overviewinstructor || "N/A"}
            </p>
            <p>
              <strong>Video Hours:</strong> {course.videoHours || "N/A"}
            </p>
            <p>
              <strong>Level:</strong> {course.courseLevel || "N/A"}
            </p>
            <p>
              <strong>Language:</strong> {course.overviewlanguage || "N/A"}
            </p>
            <p>
              <strong>Quizzes:</strong> {course.quizzes || 0}
            </p>
            <p>
              <strong>Certificate:</strong>{" "}
              {course.certificate ? "✅ Yes" : "❌ No"}
            </p>
            <p>
              <strong>Access on Mobile & TV:</strong>{" "}
              {course.accessOnMobileAndTV ? "✅ Yes" : "❌ No"}
            </p>
          </div>

          {/* Course Intro Video */}
          {course.videoUrl && ReactPlayer.canPlay(course.videoUrl) && (
            <div>
              <h3 className="text-lg font-semibold mb-2">
                📽️ Course Intro Video
              </h3>
              <ReactPlayer
                url={course.videoUrl}
                controls
                width="100%"
                height="360px"
              />
            </div>
          )}

          {/* Modules & Lessons */}
          <div>
            <h3 className="text-lg font-semibold mt-6">📦 Modules & Lessons</h3>
            {course.modules?.map((module) => (
              <div
                key={module._id}
                className="mt-4 border border-gray-200 p-4 rounded"
              >
                <h4 className="font-bold text-blue-600 mb-2">{module.title}</h4>
                <span className="text-sm text-gray-500 font-normal">
                  ({module.lessons?.length || 0} Lessons)
                </span>
                <p className="text-md font-medium mt-2 text-green-600">
                  Total Lessons:{" "}
                  {course.modules?.reduce(
                    (sum, module) => sum + (module.lessons?.length || 0),
                    0
                  ) || 0}
                </p>

                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {module.lessons?.length > 0 ? (
                    module.lessons.map((lesson) => (
                      <LessonVideoPlayer key={lesson._id} lesson={lesson} />
                    ))
                  ) : (
                    <li className="text-gray-400 italic">
                      No lessons in this module.
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllCoursesPage;
