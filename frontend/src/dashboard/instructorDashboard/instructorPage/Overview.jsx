import React, { useEffect } from "react";
import {
  FaBook,
  FaChartLine,
  FaTrophy,
  FaArrowRight,
  FaStar,
} from "react-icons/fa";
import useAuth from "./hooks/useAuth";
import { useStudentAuth } from "../../../studentDashboard/StudentesPages/studentAuth";
import { useNavigate } from "react-router-dom";

const InstructorOverview = () => {
  const {
    instructor,
    fetchInstructorReviews,
    instructorReviews,
    courses,
    fetchInstructorCourses,
  } = useAuth();

  const { allUser, fetchAllUsers } = useStudentAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchInstructorReviews();
  }, [instructor?._id]);

  useEffect(() => {
    fetchInstructorCourses();
  }, []);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleCreateCourse = () => {
    navigate("/instructor/courses-add-instructor");
  };

  const stats = [
    {
      title: "Total Courses",
      value: courses?.length || 0,
      color: "from-blue-500 to-blue-600",
      icon: FaBook,
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Students",
      value: allUser?.length || 0,
      color: "from-orange-500 to-orange-600",
      icon: FaChartLine,
      textColor: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Total Earning",
      value: "₹ " + "1000",
      color: "from-green-500 to-green-600",
      icon: FaTrophy,
      textColor: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="md:flex items-center justify-between mb-8">
        <div>
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">
            Instructor Dashboard
          </p>
          <h1 className="md:text-3xl text-2xl font-bold text-gray-900">
            Welcome back, <span className="">{instructor?.name}</span>
          </h1>
        </div>

        <button
          onClick={handleCreateCourse}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 shadow hover:opacity-90 transition"
        >
          Create a New Course <FaArrowRight />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {stats.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex items-center justify-between "> 
                <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  {item.title}
                </p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {item.value}
                </h3>
              </div>
                <div
                  className={`p-3 rounded-lg ${item.bgColor} transition-transform duration-300`}
                >
                  <IconComponent className={`w-6 h-6 ${item.textColor}`} />
                </div>
                
              </div>

              
            </div>
          );
        })}
      </div>

      {/* Feedback Table */}
      <div className="overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Recent Feedbacks
        </h2>

        <table className="min-w-full bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          <thead>
            <tr className=" bg-blue-100 text-left text-sm font-semibold text-gray-700">
              <th className="px-5 py-3">Course Name</th>
              <th className="px-5 py-3">Comment</th>
              <th className="px-5 py-3">Rating</th>
            </tr>
          </thead>
          <tbody>
            {instructorReviews?.length > 0 ? (
              instructorReviews.map((review, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 1 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="px-5 py-3 text-gray-800 font-medium">
                    {review.courseId?.title || "Untitled"}
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {review.comment || "—"}
                  </td>
                  <td className="px-5 py-3 flex items-center gap-1">
                    <div className="flex items-center gap-1 text-yellow-500 text-sm">
                      {[...Array(Math.floor(review.rating || 0))].map(
                        (_, i) => (
                          <FaStar key={i} />
                        )
                      )}
                      {review.rating % 1 !== 0 && (
                        <FaStar className="opacity-50" />
                      )}
                      <span className="text-gray-600 ml-2 font-medium">
                        ({String(review.rating || 0).padStart(2, "0")})
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="px-5 py-6 text-center text-gray-500 italic"
                >
                  No feedback available yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InstructorOverview;
