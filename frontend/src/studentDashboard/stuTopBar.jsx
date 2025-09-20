import React, { useEffect, useState } from "react";
import img1 from "../assets/image/img.jpg";
import { FaArrowRight } from "react-icons/fa";
import { PiBookOpenText, PiMedalDuotone } from "react-icons/pi";
import { useStudentAuth } from "./StudentesPages/studentAuth";
import { Link } from "react-router-dom";

const StuTopBar = () => {
  const { user, purchases } = useStudentAuth();

  const stats = [
    {
      title: "Enroll Courses",
      value: purchases.length,
      color: "bg-orange-500",
    },
    {
      title: "Active Course",
      value: "$75,250",

      color: "bg-green-500",
    },
    {
      title: "Complete Course",
      value: '10',

      color: "bg-blue-500",
    },
  ];

  return (
    // <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-10 rounded-xl flex flex-wrap md:flex-nowrap justify-between items-center gap-6">
    //   {/* Profile Section */}
    //   <div className="flex items-center gap-5">
    //     {user?.img ? (
    //       <img
    //         src={user.img}
    //         alt="Profile"
    //         className="rounded-full w-20 h-20 border-4 border-white object-cover"
    //       />
    //     ) : (
    //       <div className="rounded-full w-16 h-16 border-2 border-white bg-gray-300 flex items-center justify-center text-white font-bold text-2xl">
    //         {user?.name ? user.name.substring(0, 2).toUpperCase() : "NA"}
    //       </div>
    //     )}

    //     <div>
    //       <h2 className="text-xl font-semibold pb-2">
    //         {/* {user?.name || "Student"} */}
    //         {user?.name &&
    //           user.name.charAt(0).toUpperCase() +
    //             user.name.slice(1).toLowerCase()}
    //       </h2>

    //       <div className="flex flex-wrap gap-4 text-sm">
    //         <div className="flex items-center gap-2">
    //           <PiBookOpenText />
    //           <p>{purchases.length || 1} Courses Enrolled</p>
    //         </div>
    //         {/* <div className="flex items-center gap-2">
    //           <PiMedalDuotone />
    //           <p>4 Certificates</p>
    //         </div> */}
    //       </div>
    //     </div>
    //   </div>

    //   {/* Button */}
    //   <Link to='/dashboard/allCourse'>
    //   <button className="px-5 py-2 border border-white rounded-lg flex items-center gap-2 shadow hover:bg-white hover:text-purple-700 transition">
    //     Enroll in a New Course <FaArrowRight />
    //   </button>
    //   </Link>
    // </div>
    <>
      <div className="space-y-12">
      {/* Header */}
      <div>
        <p className="text-gray-500 text-base font-bold uppercase tracking-wider">Dashboard</p>
        <p className="text-2xl font-bold mt-1">Welcome back, {user?.name} 👋</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {stats.map((item, index) => (
          <div
            key={index}
            className="flex flex-col justify-between p-6 rounded-2xl shadow-md border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <p className="text-gray-500 text-sm font-medium">{item.title}</p>
              <span className={`h-2 w-2 rounded-full ${item.color}`}></span>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mt-3">{item.value}</h2>
          </div>
        ))}
      </div>

      {/* Graph + Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Dummy Graph */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <p className="font-semibold text-gray-700 mb-4">Course Progress Trend</p>
          <svg viewBox="0 0 100 30" className="w-full h-24 text-blue-500">
            <path
              d="M0 25 L20 15 L40 20 L60 10 L80 18 L100 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Progress Bars */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 space-y-5">
          <p className="font-semibold text-gray-700 mb-2">Completion Overview</p>
          {stats.map((item, i) => (
            <div key={i}>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">{item.title}</span>
                <span className="text-sm text-gray-500">{item.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${item.color}`}
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default StuTopBar;
