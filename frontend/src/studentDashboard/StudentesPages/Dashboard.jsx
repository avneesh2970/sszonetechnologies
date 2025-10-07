import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useStudentAuth } from "./studentAuth";
import logo from "../../assets/image/logo.png";
import { FaSearch, FaDollarSign, FaRegHeart, FaBookOpen } from "react-icons/fa";
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
import StuTopBar from "../stuTopBar";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useStudentAuth();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const linkClass =
    "flex items-center space-x-2 p-2 rounded hover:bg-blue-100 transition-colors";
  const activeClass = "bg-blue-100 text-blue-600 font-medium";

  const sidebarLinks = [
    { to: "/dashboard", icon: <MdDashboard />, label: "Dashboard" },
    {
      to: "/dashboard/enrollCourse",
      icon: <BiBookBookmark />,
      label: "My Courses",
    },
    { to: "/dashboard/allCourse", icon: <FaBookOpen />, label: " All Courses" },
    { to: "/dashboard/myQuiz", icon: <MdQuiz />, label: "My Quiz" },
    {
      to: "/dashboard/assignments",
      icon: <BiBookBookmark />,
      label: "Assignments",
    },
    { to: "/dashboard/myOrder", icon: <FaDollarSign />, label: "My Order" },
    { to: "/dashboard/profile", icon: <MdPerson />, label: "My Profile" },
    { to: "/dashboard/review", icon: <MdRateReview />, label: "Reviews" },
    { isDivider: true },
    { to: "/dashboard/setting", icon: <MdSettings />, label: "Settings" },
    { to: "/dashboard/logout", icon: <MdLogout />, label: "Logout" },
  ];

  const navLinks = [
    { to: "/dashboard/wishlist", icon: <FaRegHeart />, label: "Wishlist" },
    { to: "/dashboard/message", icon: <MdMessage />, label: "Messages" },
  ];

  return (
    <>
      {/* Top Navbar */}
      <div className="bg-white px-4 md:px-6 py-3 shadow flex justify-between items-center w-full sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleSidebar}
            className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none"
          >
            {sidebarOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>

          <Link to="/" className="flex items-center">
            <img src={logo} alt="Logo" className="h-8 md:h-10 w-auto" />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search for course..."
              className="border px-3 py-1.5 rounded-2xl pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-44 md:w-56"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end
                className={({ isActive }) =>
                  `flex items-center justify-center p-2 rounded-full transition-colors duration-200 
                  hover:text-blue-600 hover:bg-blue-50 text-xl md:text-2xl 
                  ${isActive ? " bg-blue-100 text-blue-600" : "text-gray-500"}`
                }
              >
                {link.icon}
              </NavLink>
            ))}
          </div>

          <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 text-sm font-medium w-9 h-9 flex items-center justify-center">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : "NA"}
          </button>
        </div>
      </div>

      {/* MOBILE overlay when sidebar open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Body */}
      <div className="bg-[#f3f5f7] min-h-screen">
        {/* Sidebar (fixed) */}
        <aside
          className={`fixed left-0 top-16  /* top equals navbar height (4rem) */
                      h-[calc(100vh-4rem)] w-64 bg-white shadow-md overflow-y-auto
                      transition-transform duration-300 z-40
                      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                      md:translate-x-0`}
        >
          <nav className="space-y-2 text-gray-600 p-6">
            {sidebarLinks.map((link, index) =>
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
                  onClick={() => setSidebarOpen(false)}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </NavLink>
              )
            )}
          </nav>
        </aside>

        {/* Main Content: push right on md+ so it doesn't sit under the fixed sidebar */}
        <main className="px-2 pt-2 md:ml-64">
          {/* <StuTopBar /> */}
          <Outlet />
        </main>
      </div>

      <ToastContainer autoClose={2000} />
    </>
  );
};

export default Dashboard;
