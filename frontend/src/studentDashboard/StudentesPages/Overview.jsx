import {
  FaBook,
  FaUserGraduate,
  FaStar,
  FaChartLine,
  FaTrophy,
  FaMoneyBillWave,
  FaGraduationCap,
} from "react-icons/fa";
import { useEffect } from "react";
import { useStudentAuth } from "./studentAuth";

// Mock data for demonstration

const feedbacks = [
  { course: "JavaScript", enrolled: "1,200", rating: 4.1 },
  { course: "PHP", enrolled: "1,500", rating: 3.9 },
  { course: "Graphics Designer", enrolled: "2,500", rating: 4.7 },
  { course: "Data Science", enrolled: "2,290", rating: 4.5 },
];

const Overview = () => {
  const { fetchReviews, user, purchases } = useStudentAuth();

  useEffect(() => {
    fetchReviews();
  }, [user]);

  // Mock auth hook for demonstration
  // const user = mockUser;
  // const purchases = mockPurchases;
  

  useEffect(() => {
    // fetchReviews();
  }, [user]);

  // Calculate statistics
  const completedCourses = purchases.filter(
    (course) => course.progress === 100
  ).length;
  const activeCourses = purchases.filter(
    (course) => course.progress > 0 && course.progress < 100
  ).length;
  const averageProgress =
    purchases.length > 0
      ? Math.round(
          purchases.reduce((acc, course) => acc + course.progress, 0) /
            purchases.length
        )
      : 0;

  const stats = [
    {
      title: "Enrolled Courses",
      value: purchases.length,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      icon: FaBook,
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      // change: "+2 this month",
      // changeColor: "text-green-600"
    },
    {
      title: "Active Courses",
      value: activeCourses,
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      icon: FaChartLine,
      textColor: "text-orange-600",
      bgColor: "bg-orange-50",
      // change: `${averageProgress}% avg progress`,
      // changeColor: "text-orange-600"
    },
    {
      title: "Completed Courses",
      value: completedCourses,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      icon: FaTrophy,
      textColor: "text-green-600",
      bgColor: "bg-green-50",
      // change: "+1 this week",
      // changeColor: "text-green-600"
    },
  ];

  return (
    <div className="  p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"> */}
        <div className=" ">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
                Student Dashboard
              </p>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name || "Student"}
              </h1>
              <p className="text-gray-600 mt-1">
                Track your learning progress and achievements
              </p>
            </div>
            {/* <div className="hidden md:flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
              <FaGraduationCap className="text-blue-600" />
              <span className="text-blue-700 font-medium">Learning Mode</span>
            </div> */}
          </div>
        </div>

        {/* Stats Cards */}
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
                  <p className="text-gray-500 text-sm font-medium">
                    {item.title}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {item.value}
                  </h3>
                  <p className={`text-xs font-medium ${item.changeColor}`}>
                    {item.change}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Course Progress Chart */}
          <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Learning Progress
              </h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                  This Week
                </button>
                <button className="px-3 py-1 text-gray-500 rounded-lg text-sm font-medium hover:bg-gray-100">
                  This Month
                </button>
              </div>
            </div>

            {/* Enhanced Chart */}
            <div className="relative">
              <svg viewBox="0 0 400 150" className="w-full h-32">
                <defs>
                  <linearGradient
                    id="progressGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.8" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Grid lines */}
                <defs>
                  <pattern
                    id="grid"
                    width="40"
                    height="30"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 30"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect
                  width="100%"
                  height="100%"
                  fill="url(#grid)"
                  opacity="0.5"
                />

                {/* Progress line */}
                <path
                  d="M0 120 L60 85 L120 95 L180 60 L240 75 L300 45 L360 35 L400 25"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  filter="url(#glow)"
                />

                {/* Data points */}
                {[
                  { x: 0, y: 120 },
                  { x: 60, y: 85 },
                  { x: 120, y: 95 },
                  { x: 180, y: 60 },
                  { x: 240, y: 75 },
                  { x: 300, y: 45 },
                  { x: 360, y: 35 },
                  { x: 400, y: 25 },
                ].map((point, i) => (
                  <circle
                    key={i}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="#1D4ED8"
                    className="hover:r-6 transition-all duration-200 cursor-pointer"
                  />
                ))}
              </svg>
            </div>

            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>

          {/* Course Completion */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Course Progress
            </h3>
            <div className="space-y-4">
              {purchases.map((course, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {course.course}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {course.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000 ease-out"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Courses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Popular Courses
            </h3>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {feedbacks.map((course, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {course.course}
                  </h4>
                  <div className="flex items-center space-x-1">
                    <FaStar className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-600">
                      {course.rating}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <FaUserGraduate className="w-3 h-3" />
                    <span>{course.enrolled}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
