import React, { useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  FaBook,
  FaChartLine,
  FaStar,
  FaTrophy,
} from "react-icons/fa";
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

function EnrolledCoursesChart() {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md w-full">
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
  const { allUser = [], fetchAllUsers } = useStudentAuth();

  const {
    totalAmount = 0,
    fetchPayments,
    averageRating = 0,
    profile,
    allCourses = [],
    fetchAllCourses,
    allReviews = [],
    fetchAllReviews,
  } = useAdminAuth();

  useEffect(() => {
    fetchAllUsers();
    fetchPayments();
    fetchAllCourses();
    fetchAllReviews();
  }, []);

  const stats = [
    {
      title: "Total Courses",
      value: allCourses?.length || 0,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      icon: FaBook,
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Students",
      value: allUser?.length || 0,
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      icon: FaChartLine,
      textColor: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Total Earning",
      value: "₹ " + totalAmount,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      icon: FaTrophy,
      textColor: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="md:flex items-center md:gap-20 mb-6">
        <div>
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
            Admin Dashboard
          </p>
          <h1 className="md:text-3xl text-2xl font-bold text-gray-900">
            Welcome back, {profile?.firstName || "Admin"}
          </h1>
        </div>

        <div className="flex items-center gap-2 text-lg mt-3 md:mt-0">
          <FaStar className="text-yellow-300" />
          <span>
            {averageRating} ({allReviews?.length || 0} Reviews)
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg ${item.bgColor} group-hover:scale-110 transition-transform duration-300`}
                >
                  <IconComponent className={`w-6 h-6 ${item.textColor}`} />
                </div>
                <div className={`h-3 w-3 rounded-full ${item.color}`}></div>
              </div>

              <div className="space-y-2">
                <p className="text-gray-500 text-sm font-medium">{item.title}</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {item.value}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart + Feedback */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EnrolledCoursesChart />

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Recent Feedbacks</h3>
            <Link to="/admin/review">
              <span className="text-sm text-gray-400 cursor-pointer">
                See More...
              </span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-blue-50 text-gray-700 text-left">
                <tr>
                  <th className="px-4 py-2">User</th>
                  <th className="px-4 py-2">Comment</th>
                  <th className="px-4 py-2">Rating</th>
                </tr>
              </thead>
              <tbody>
                {allReviews.slice(0, 5).map((review, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}
                  >
                    <td className="px-4 py-2">
                      {review?.userId?.name
                        ? review.userId.name.charAt(0).toUpperCase() +
                          review.userId.name.slice(1).toLowerCase()
                        : "Unknown User"}
                    </td>
                    <td className="px-4 py-2">{review?.comment || "-"}</td>
                    <td className="px-4 py-2 flex items-center gap-1">
                      <FaStar className="text-yellow-400" />{" "}
                      {review?.rating || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
