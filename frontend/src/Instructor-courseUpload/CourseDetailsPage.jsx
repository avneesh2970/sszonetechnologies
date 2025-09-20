import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactPlayer from "react-player";
import LessonVideoPlayer from "./LassonVideoPlayer";

const CourseDisplayPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/courses/${id}/full`);
        setCourse(res.data);
      } catch (error) {
        console.error("❌ Failed to fetch course data", error);
      }
    };
    fetchData();
  }, [id]);

  if (!course) {
    return <div className="text-center text-gray-600 p-8">Loading course...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      {/* Course Header */}
      <div className="space-y-4">
        {course.thumbnail && (
          <img
            src={course.thumbnail}
            alt="Course Thumbnail"
            className="w-full h-64 object-cover rounded-lg shadow"
          />
        )}
        <h1 className="text-3xl font-bold text-blue-700">{course.title}</h1>
      </div>

      {/* Course Details */}
      <div className="bg-white p-6 rounded-lg shadow space-y-2">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">📘 Course Info</h2>
        <p><strong>Slug:</strong> {course.slug}</p>
        <p><strong>Categories:</strong> {course.categories?.join(", ") || "N/A"}</p>
        <p>
          <strong>Price:</strong> ₹{course.discountPrice}
          {" "}
          <span className="line-through text-gray-400">₹{course.regularPrice}</span>
        </p>
        <p><strong>Language:</strong> {course.language}</p>
        <p><strong>Start Date:</strong> {course.startDate}</p>
        <p><strong>Requirements:</strong> {course.requirements}</p>
        <p><strong>Description:</strong> {course.description}</p>
        <p><strong>Duration:</strong> {course.durationHour}h {course.durationMinute}m</p>
        <p><strong>Tags:</strong> {course.tags?.join(", ") || "None"}</p>
      </div>

      {/* Intro Video */}
      {course.videoUrl && ReactPlayer.canPlay(course.videoUrl) && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">🎬 Course Intro Video</h2>
          <ReactPlayer
            url={course.videoUrl}
            controls
            width="100%"
            height="360px"
            style={{ borderRadius: "12px", overflow: "hidden" }}
          />
        </div>
      )}

      {/* Modules and Lessons */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">📦 Modules & Lessons</h2>
        {course.modules?.length > 0 ? (
          course.modules.map((module) => (
            <div key={module._id} className="mb-6">
              <h3 className="text-lg font-semibold text-indigo-600 mb-2">{module.title}</h3>
              <ul className="list-disc pl-6 space-y-2">
                {module.lessons?.length > 0 ? (
                  module.lessons.map((lesson) => (
                    <LessonVideoPlayer key={lesson._id} lesson={lesson} />
                  ))
                ) : (
                  <li className="text-gray-400 italic">No lessons available.</li>
                )}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No modules found for this course.</p>
        )}
      </div>
    </div>
  );
};

export default CourseDisplayPage;
