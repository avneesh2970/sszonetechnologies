
import React, { useState, useEffect } from "react";
import img1 from "../../../assets/image/img1.png";
import { Link } from "react-router-dom";
import { FaBook, FaClock, FaRegStar, FaTimes } from "react-icons/fa";
import { HiOutlineClock } from "react-icons/hi";
import axios from "axios";

const TabButton = ({ label, active, onClick }) => (
  <button
    className={`px-4 py-2 font-semibold ${
      active ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

const AdminCourse = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [courses, setCourses] = useState([]);

  const filteredCoursesMain = courses.filter(
    (course) => course.status === activeTab
  );

  // console.log("courses", courses);

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const res = await axios.get( `${import.meta.env.VITE_BACKEND_URL}/api/instructor-courses`
          // `${import.meta.env.VITE_BACKEND_URL}/api/courses/all/full`
        );
        setCourses(res.data.courses || []);
      } catch (err) {
        console.error("Error fetching courses", err);
      }
    };
    fetchAllCourses();
  }, []);

  return (
    <>
      <div className="p-6 font-sans">
        <h1 className="text-2xl font-bold mb-4">Enroll Courses</h1>
        <div className="flex space-x-6 border-b pb-2">
          <TabButton
            label="Published"
            active={activeTab === "Published"}
            onClick={() => setActiveTab("Published")}
          />
          <TabButton
            label="Pending"
            active={activeTab === "Pending"}
            onClick={() => setActiveTab("Pending")}
          />
          {/* <TabButton
            label="Draft"
            active={activeTab === "Draft"}
            onClick={() => setActiveTab("Draft")}
          /> */}
        </div>
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3 mt-6 px-4 mb-8">
        {filteredCoursesMain.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 text-lg">
            No courses found for {activeTab}.
          </p>
        ) : (
          filteredCoursesMain.map((course, index) => (
            <div
              key={course.id || index}
              className="bg-white p-5 rounded-2xl shadow-lg w-full max-w-sm mx-auto hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}${course.thumbnail}`}
                  alt="course"
                  className="w-full h-44 object-cover  rounded-xl"
                />
                <button className="absolute top-3 left-3 text-white bg-[#296AD2] px-3 py-1 rounded-full text-xs font-semibold">
                  <span className="flex items-center gap-1">
                    <HiOutlineClock className="text-sm" />
                    {course.additionalInfo?.duration
                    ? `${course.additionalInfo.duration.hour}h ${course.additionalInfo.duration.minute}m`
                    : "N/A"}
                  </span>
                </button>
              </div>

              <h2 className="text-lg font-semibold mt-4 text-gray-800">
                {course.title}
              </h2>
              <p className="text-gray-600 text-sm mt-1">{course.description}</p>

              <div className="flex justify-between items-center mt-3 text-sm text-gray-700">
                <span className="flex items-center gap-1">
                  <FaBook />{" "}
                  {course.modules?.reduce(
                    (sum, module) => sum + (module.lessons?.length || 0),
                    0
                  ) || 0}{" "}
                  Lessons
                </span>
                <span className="flex items-center gap-1">
                  <FaRegStar className="text-yellow-500" /> {course.rating}
                </span>
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="text-lg font-bold text-green-600">
                  ₹ {course.discountPrice} <span className="text-sm line-through text-black">{course.regularPrice}</span>
                </p>
                <Link
                  to={`/admin/adminCourseDetails/${course._id}`}
                  state={course}
                  className="text-sm text-[#296AD2] font-medium border border-[#296AD2] px-3 py-1 rounded hover:bg-[#296AD2] hover:text-white transition-all duration-200"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default AdminCourse;
