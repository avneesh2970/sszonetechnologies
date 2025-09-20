import React, { useEffect } from "react";
import { FaBook, FaUserGraduate, FaMoneyBillWave } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import useAuth from "./hooks/useAuth";
import { useStudentAuth } from "../../../studentDashboard/StudentesPages/studentAuth";

const InstructorOverview = () => {
  const {
    instructor,
    fetchInstructorReviews,
    instructorReviews,
    courses,
    fetchInstructorCourses
  } = useAuth();

  const { allUser, fetchAllUsers } = useStudentAuth();

  useEffect(() => {
    fetchInstructorReviews();
  }, [instructor?._id]);

   useEffect(() => {
    fetchInstructorCourses();
  }, []);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const statsData = [
    {
      id: 1,
      icon: <FaBook className="text-white text-2xl" />,
      value: courses ? courses.length : 0,
      label: "Total Courses",
    },
    {
      id: 2,
      icon: <FaUserGraduate className="text-white text-2xl" />,
      value: allUser.length,
      label: "Total Student",
    },
    {
      id: 3,
      icon: <FaMoneyBillWave className="text-white text-2xl" />,
      value: "12",
      label: "Total Earning",
    },
  ];

  return (
    <>
      <p className="font-semibold text-lg mb-2">Summary</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6 ">
        {statsData.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded shadow flex items-center space-x-4 border"
          >
            <div className="border w-10 h-10 rounded-full flex items-center justify-center bg-[#296AD2]">
              {item.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold">{item.value}</h3>
              <p className="text-gray-500 text-sm">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Recent Feedbacks </h2>

        <table className="min-w-full table-auto bg-white rounded-md shadow">
          <thead>
            <tr className="bg-blue-100 text-left text-sm font-medium text-gray-700">
              <th className="px-4 py-2">Course Name</th>
              <th className="px-4 py-2">Comment</th>
              <th className="px-4 py-2">Rating</th>
            </tr>
          </thead>
          <tbody>
            {instructorReviews.map((review, index) => (
              <tr
                key={index}
                className={index % 2 === 1 ? "bg-blue-50" : "bg-white"}
              >
                <td className="px-4 py-2">{review.courseId?.title}</td>
                <td className="px-4 py-2">{review.comment}</td>
                <td className="px-4 py-2 flex items-center gap-1">
                  <div className="flex items-center gap-1 text-yellow-500 text-sm">
                    {[...Array(Math.floor(review.rating))].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                    {review.rating % 1 !== 0 && (
                      <FaStar className="opacity-50" />
                    )}
                    <span className="text-gray-600 ml-2">
                      ({String(review.rating).padStart(2, "0")})
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default InstructorOverview;
