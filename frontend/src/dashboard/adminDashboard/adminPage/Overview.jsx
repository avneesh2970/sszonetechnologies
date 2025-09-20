import React, { useEffect } from "react";

import { FaBook, FaUserGraduate, FaMoneyBillWave } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { FaStar, FaUser, FaBookOpen, FaRegCommentDots } from "react-icons/fa";
import { useStudentAuth } from "../../../studentDashboard/StudentesPages/studentAuth";
import useAdminAuth from "./AdminAuth";
import { Link } from "react-router-dom";

const data = [
  { month: "Jan", students: 100 },
  { month: "Feb", students: 250 },
  { month: "Mar", students: 300 },
  { month: "Apr", students: 640 },
  { month: "May", students: 1200 },
  { month: "Jun", students: 900 },
  { month: "Jul", students: 600 },
  { month: "Aug", students: 700 },
  { month: "Sept", students: 800 },
  { month: "Oct", students: 900 },
  { month: "Nov", students: 850 },
  { month: "Dec", students: 780 },
];

const instructors = Array(6).fill({
  name: "Sanki Jho",
  reviews: "25,895 Reviews",
  courses: "15+ Courses",
  students: "692 Students",
  avatar: "https://i.pravatar.cc/40?img=3",
});

const notifications = [
  "Account has been created successfully.",
  "Successfully applied for a job Developer.",
  "Multi vendor course updated successfully.",
  "HTML course updated successfully.",
  "HTML course updated successfully.",
  "HTML course updated successfully.",
  "JavaScript course updated successfully.",
];

const feedbacks = [
  { name: "JavaScript", enrolled: "1,200", rating: 4.1 },
  { name: "PHP", enrolled: "1,500", rating: 3.9 },
  { name: "Graphics Designer", enrolled: "2,500", rating: 4.7 },
  { name: "Data Science", enrolled: "2,290", rating: 4.5 },
];

function EnrolledCoursesChart() {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md w-full ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Courses Enrolled Status
        </h2>
        <select className="border text-sm rounded px-2 py-1">
          <option>HTML</option>
          <option>React</option>
          <option>JS</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="students"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const AdminOverview = () => {
  const { allUser, fetchAllUsers } = useStudentAuth();
  const {totalAmount , fetchPayments ,allCourses , fetchAllCourses , allReviews, fetchAllReviews,} = useAdminAuth()

  useEffect(() => {
    fetchAllUsers();
    fetchPayments();
    fetchAllCourses();
    fetchAllReviews();
  }, []);
  
  
  return (
    <>
      <div className="max-w-screen-2xl mx-auto">
        <p className="font-semibold text-lg mb-2">Summary</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-4 rounded shadow flex items-center space-x-4">
            <div className="border w-10 h-10 rounded-full flex items-center justify-center bg-[#296AD2]">
              <FaBook className="text-white text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold">{allCourses.length}</h3>
              <p className="text-gray-500 text-sm">Total Courses</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded shadow flex items-center space-x-4">
            <div className="border w-10 h-10 rounded-full flex items-center justify-center bg-[#296AD2]">
              <FaUserGraduate className="text-white text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold">{allUser.length}</h3>
              <p className="text-gray-500 text-sm">Total Students</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded shadow flex items-center space-x-4">
            <div className="border w-10 h-10 rounded-full flex items-center justify-center bg-[#296AD2]">
              <FaMoneyBillWave className="text-white text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold">₹ {totalAmount}</h3>
              <p className="text-gray-500 text-sm">Total Earning </p>
            </div>
          </div>
        </div>

        {/* Courses Enrolled Status (Placeholder) */}

        <div className="bg-gray-100 rounded flex items-center justify-center text-gray-400">
          <EnrolledCoursesChart />
        </div>

        <div className="p-6 space-y-6">
          {/* Top Cards */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Popular Instructor</h3>
                <span className="text-sm text-gray-400 cursor-pointer">
                  See More...
                </span>
              </div>
              <div className="space-y-4">
                {instructors.map((inst, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <img
                      src={inst.avatar}
                      alt="avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="text-sm space-y-1">
                      <p className="font-semibold">{inst.name}</p>
                      <div className="flex gap-3 text-gray-500 text-xs items-center">
                        <span className="flex items-center gap-1">
                          <FaRegCommentDots /> {inst.reviews}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaBookOpen /> {inst.courses}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaUser /> {inst.students}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Notifications</h3>
                <span className="text-sm text-gray-400 cursor-pointer">
                  See More...
                </span>
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                {notifications.map((note, idx) => (
                  <div key={idx}>
                    <p>{note}</p>
                    <span className="text-xs text-gray-400">
                      {idx + 1} Hour Ago
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div> */}

          {/* Recent Feedbacks */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Recent Feedbacks</h3>
              <Link to='/admin/review'>
              <span className="text-sm text-gray-400 cursor-pointer">
                See More...
              </span>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-blue-50 text-gray-700 text-left">
                  <tr>
                    <th className="px-4 py-2">Course Name</th>
                    <th className="px-4 py-2">Comment</th>
                    <th className="px-4 py-2">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {allReviews.slice(0,5).map((review, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}
                    >
                      <td className="px-4 py-2">{review.userId.name.charAt(0).toUpperCase() + review.userId.name.slice(1).toLowerCase()}</td>
                      <td className="px-4 py-2">{review.comment}</td>
                      <td className="px-4 py-2 flex items-center gap-1">
                        <FaStar className="text-yellow-400" /> {review.rating}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminOverview;
