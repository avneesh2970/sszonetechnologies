import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdMessage,
  MdRateReview,
  MdQuiz,
  MdSettings,
  MdLogout,
  MdPerson,
  MdMenu,
  MdClose,
} from "react-icons/md";
import { BiBookBookmark } from "react-icons/bi";
import { FaRegHeart, FaTv } from "react-icons/fa";
import { FaMicroblog } from "react-icons/fa6";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const linkClass =
    "flex items-center space-x-2 p-2 rounded hover:bg-blue-100 transition-colors";
  const activeClass = "bg-blue-100 text-blue-600 font-medium";

  const navLinks = [
    { to: "/", icon: <MdDashboard />, label: "Dashboard" },
    { to: "/profile,,,,,,,", icon: <MdPerson />, label: "My Profile" },
    // { to: "/enrollCourse", icon: <BiBookBookmark />, label: "Enroll Courses" },
    { to: "/wishlist", icon: <FaRegHeart />, label: "Wishlist" },
    { to: "/message", icon: <MdMessage />, label: "Messages" },
    { to: "/review", icon: <MdRateReview />, label: "Reviews" },
    { to : '/mycourses', icon : <FaTv/> , label : "My Course"},
    { to: "/myQuiz", icon: <MdQuiz />, label: "My Quiz" },
    { to : '/announcement', icon : <FaMicroblog/> ,label : "Announcement" },
    // { to: "/assignments", icon: <BiBookBookmark />, label: "Assignments" },
    { to : '/orderhistory', icon : <BiBookBookmark/> , label : "Order History"},
    { isDivider: true },
    { to: "/setting", icon: <MdSettings />, label: "Settings" },
    { to: "/logout", icon: <MdLogout />, label: "Logout" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 font-sans  ">
      {/* Mobile Header */}
      <div className="flex items-center justify-between bg-white p-4 shadow-md md:hidden">
        {/* <h1 className="text-xl font-semibold">Dashboard</h1> */}
        <button onClick={toggleSidebar}>
          {sidebarOpen ? <MdClose size={20} /> : <MdMenu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
  className={`fixed md:static top-[25px] left-0 h-full bg-white shadow p-6 w-64 z-50 transition-transform transform ${
    sidebarOpen ? "translate-x-0" : "-translate-x-full"
  } md:translate-x-0 md:block`}
>
  {/* Close button visible only on mobile */}
  <div className="flex justify-end mb-4 md:hidden">
    <button onClick={toggleSidebar} className="text-gray-600 hover:text-red-500">
      <MdClose size={24} />
    </button>
  </div>

  <nav className="space-y-2 text-gray-600 ">
    {navLinks.map((link, index) =>
      link.isDivider ? (
        <hr key={index} className="my-4" />
      ) : (
        <NavLink
          key={link.to}
          to={link.to}
          end
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
          onClick={() => setSidebarOpen(false)} // closes sidebar on link click (mobile)
        >
          {link.icon}
          <span>{link.label}</span>
        </NavLink>
      )
    )}
  </nav>
</aside>

      
    </div>
  );
}
