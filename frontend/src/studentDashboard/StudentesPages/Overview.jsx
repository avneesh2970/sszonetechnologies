import {
  FaBook,
  FaUserGraduate,
  FaStar,
  FaChartLine,
  FaTrophy,
} from "react-icons/fa";
import { useEffect } from "react";
import { useStudentAuth } from "./studentAuth";
import useCourseCounts from "./utils/courseCount";
import DashboardCourseProgress from "./DashboardCourseProgress";
import DashboardLearningGraph from "./DashboardLearningGraph";

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

  useEffect(() => {
    // fetchReviews();
  }, [user]);

  const userId = user?.id || user?._id || "anon";

  const { activeCount, completedCount } = useCourseCounts(purchases, userId);

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
      value: activeCount,
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      icon: FaChartLine,
      textColor: "text-orange-600",
      bgColor: "bg-orange-50",
      // change: `${averageProgress}% avg progress`,
      // changeColor: "text-orange-600"
    },
    {
      title: "Completed Courses",
      value: completedCount,
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

        {/* Course Progress Chart */}
        <div className="xl:col-span-2 bg-white rounded-xl   p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Learning Progress 
            </h3>
          </div>
          <DashboardLearningGraph />
        </div>

        {/* Popular Courses */}
        {/* <div className="bg-white rounded-xl  border border-gray-200 p-6">
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
        </div> */}
      </div>
    </div>
  );
};

export default Overview;
