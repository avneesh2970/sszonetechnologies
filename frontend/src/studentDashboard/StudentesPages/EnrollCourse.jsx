import React, { useState } from "react";
import img1 from "../../assets/image/img1.png";
import { MdLockOutline } from "react-icons/md";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useStudentAuth } from "./studentAuth";

const coursesData = [
  {
    title: "Learning JavaScript With Imagination",
    instructor: "Wilson",
    rating: 4.2,
    reviews: 2,
    lessons: 23,
    duration: "05 Weeks",
    image: img1,
  },
];

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

const CourseCard = ({ data, button, percent, showLockIcon }) => (
  <div className="bg-white p-4 rounded-lg shadow-md w-72">
    <div className="relative">
      <img
        src={data.image}
        alt="course"
        className="w-full h-40 object-cover rounded-md"
      />
    </div>
    <span className="text-xs inline-block bg-blue-100 text-blue-600 rounded-full px-2 py-1 mt-2">
      Development
    </span>
    <h2 className="text-md font-semibold mt-2">{data.title}</h2>
    <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
      <div className="flex">
        <img
          src="https://i.pravatar.cc/24"
          alt="avatar"
          className="w-5 h-5 rounded-full mr-2"
        />
        {data.instructor}
      </div>
      <div>
        <span className="ml-2 text-yellow-500">★ {data.rating}</span>
        <span className="ml-1">({data.reviews} Reviews)</span>
      </div>
    </div>
    <div>
      <div className="flex justify-between">
        <p className="text-xs text-gray-400 mt-1"> Complete</p>
        <p className="text-xs text-gray-400 mt-1">{percent}%</p>
      </div>
      <input type="range" className="w-full " />
    </div>
    <div className="flex gap-6 text-sm text-gray-600 mt-2">
      <span>📘 {data.lessons} Lesson</span>
      <span>⏱ {data.duration}</span>
    </div>
    <button className="mt-3 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition flex justify-center items-center gap-2">
      {button}
      {showLockIcon && <MdLockOutline />}
    </button>
  </div>
);

const EnrollCourse = () => {
  const { purchases } = useStudentAuth();

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Active");

  const averageRating =
    purchases?.reviews?.length > 0
      ? (
          purchases.reviews.reduce((sum, r) => sum + r.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;
  console.log("Purchase0", purchases.reviews);

  const renderContent = () => {
    switch (activeTab) {
      case "Enroll":
        return (
          
          <>
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex flex-wrap gap-4 mt-6">
                {purchases.map((purchase) =>
                  purchase.product.map((course) => (
                    <div
                      key={course._id}
                      className="bg-white p-4 rounded-lg shadow-md w-72 flex flex-col justify-between"
                    >
                      {/* Thumbnail */}
                      <div>
                        <div className="relative">
                          <img
                            src={`${import.meta.env.VITE_BACKEND_URL}${
                              course.thumbnail
                            }`}
                            alt={course.title}
                            className="w-full h-40 object-cover rounded-md"
                          />
                        </div>

                        {/* Category */}
                        <span className="text-xs inline-block bg-blue-100 text-blue-600 rounded-full px-2 py-1 mt-2">
                          {course.categories || "Development"}
                        </span>

                        {/* Title */}
                        <h2 className="text-md font-semibold mt-2">
                          {course.title}
                        </h2>

                        {/* Instructor + Rating */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
                          <div className="flex items-center">
                            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center mr-2 text-sm font-bold uppercase">
                              {course.instructor?.name
                                ? course.instructor.name
                                    .slice(0, 1)
                                    .toUpperCase()
                                : "NA"}
                            </div>
                            <span>{course.instructor?.name || "Unknown"}</span>
                          </div>

                          <div>
                            <span className="ml-2 text-yellow-500">
                              {averageRating} ⭐
                            </span>
                            {/* <span className="ml-1">
                              ({course.reviews || 10} Reviews)
                            </span> */}
                          </div>
                        </div>

                        {/* Progress */}

                        {/* Lessons + Duration */}
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                          <span>
                            📘{" "}
                            {course.modules?.reduce(
                              (acc, m) => acc + m.lessons.length,
                              0
                            )}{" "}
                            Lessons
                          </span>
                          <span>
                            ⏱ {course.additionalInfo?.duration?.hour || 0}h{" "}
                            {course.additionalInfo?.duration?.minute || 0}m
                          </span>
                          <p>
                            ₹ {}
                            {course.discountPrice}
                          </p>
                        </div>
                      </div>

                      {/* Go To Course Button */}
                      <button
                        onClick={() =>
                          navigate(
                            `/dashboard/enrollCourseDetails/${course._id}`
                          )
                        }
                        className="mt-3 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition flex justify-center items-center gap-2"
                      >
                        Go to Course
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        );
      case "Active":
        return (
          <div className="flex flex-wrap gap-4 mt-6">
            <p>this is for active class</p>
          </div>
        );
      case "Completed":
        return (
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex flex-wrap gap-4 mt-6">
              {purchases.map((purchase) =>
                purchase.product.map((course) => (
                  <div
                    key={course._id}
                    className="bg-white p-4 rounded-lg shadow-md w-72 flex flex-col justify-between"
                  >
                    {/* Thumbnail */}
                    <div>
                      <div className="relative">
                        <img
                          src={`${import.meta.env.VITE_BACKEND_URL}${
                            course.thumbnail
                          }`}
                          alt={course.title}
                          className="w-full h-40 object-cover rounded-md"
                        />
                      </div>

                      {/* Category */}
                      <span className="text-xs inline-block bg-blue-100 text-blue-600 rounded-full px-2 py-1 mt-2">
                        {course.categories || "Development"}
                      </span>

                      {/* Title */}
                      <h2 className="text-md font-semibold mt-2">
                        {course.title}
                      </h2>

                      {/* Instructor + Rating */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
                        <div className="flex">
                          <img
                            src={
                              course.instructor?.profileImage ||
                              "https://i.pravatar.cc/24"
                            }
                            alt="avatar"
                            className="w-5 h-5 rounded-full mr-2"
                          />
                          {course.instructor?.name}
                        </div>
                        <div>
                          <span className="ml-2 text-yellow-500">
                            ★ {course.rating || 4.5}
                          </span>
                          <span className="ml-1">
                            ({course.reviews || 10} Reviews)
                          </span>
                        </div>
                      </div>

                      {/* Progress */}
                      <div>
                        <div className="flex justify-between">
                          <p className="text-xs text-gray-400 mt-1">
                            {" "}
                            Complete
                          </p>
                        </div>
                        <input type="range" className="w-full" />
                      </div>

                      {/* Lessons + Duration */}
                      <div className="flex gap-6 text-sm text-gray-600 mt-2">
                        <span>
                          📘{" "}
                          {course.modules?.reduce(
                            (acc, m) => acc + m.lessons.length,
                            0
                          )}{" "}
                          Lessons
                        </span>
                        <span>
                          ⏱ {course.additionalInfo?.duration?.hour || 0}h{" "}
                          {course.additionalInfo?.duration?.minute || 0}m
                        </span>
                        <p>{course.discountPrice}</p>
                      </div>
                    </div>

                    {/* Go To Course Button */}
                    <button
                      onClick={() =>
                        navigate(`/dashboard/enrollCourseDetails/${course._id}`)
                      }
                      className="mt-3 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition flex justify-center items-center gap-2"
                    >
                      Go to Course
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 ">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
      <div className="flex space-x-6 border-b pb-2">
        <TabButton
          label="Enroll Courses"
          active={activeTab === "Enroll"}
          onClick={() => setActiveTab("Enroll")}
        />
        <TabButton
          label="Active Courses"
          active={activeTab === "Active"}
          onClick={() => setActiveTab("Active")}
        />
        <TabButton
          label="Completed Courses"
          active={activeTab === "Completed"}
          onClick={() => setActiveTab("Completed")}
        />
      </div>
      {renderContent()}
    </div>
  );
};

export default EnrollCourse;
