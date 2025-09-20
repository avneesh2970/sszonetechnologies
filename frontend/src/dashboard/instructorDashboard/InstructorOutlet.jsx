import React, { useState } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import logo from "../../assets/image/logo.png";
import { FaSearch } from "react-icons/fa";
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
import { FaMicroblog } from "react-icons/fa6";
import { FaTv } from "react-icons/fa";
import InstructorTopBar from "./InstructorTopBar";

const InstructorOutlet = () => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/instructor/logout`,
        {},
        { withCredentials: true }
      );
      toast.success("Logged out successfully");
      navigate("/instructor/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const linkClass =
    "flex items-center space-x-2 p-2 rounded hover:bg-blue-100 transition-colors";
  const activeClass = "bg-blue-100 text-blue-600 font-medium";

  const navLinks = [
    { to: "/instructor", icon: <MdDashboard />, label: "Dashboard" },
    { to: "/instructor/profile", icon: <MdPerson />, label: "My Profile" },
    { to: "/instructor/mycourses", icon: <FaTv />, label: "My Courses" },
    { to: "/instructor/message", icon: <MdMessage />, label: "Messages" },
    { to: "/instructor/review", icon: <MdRateReview />, label: "Reviews" },
    { to: "/instructor/myQuiz", icon: <MdQuiz />, label: "My Quiz" },
    { to: "/instructor/announcement", icon: <FaMicroblog />, label: "Announcement" },
    { isDivider: true },
    { to: "/instructor/setting", icon: <MdSettings />, label: "Settings" },
    { to: "/instructor/logout", icon: <MdLogout />, label: "Logout" },
  ];

  return (
    <div className="max-w-screen-2xl mx-auto">
      {/* Top Navbar */}
      <div className="border-b bg-white px-4 md:px-6 py-4 shadow flex justify-between items-center w-full sticky top-0 z-50">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleSidebar}
            className="md:hidden text-gray-700 hover:text-blue-600"
          >
            {sidebarOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
          <img src={logo} alt="Logo" className="h-8 md:h-10 w-auto" />
        </div>

        {/* Right: Search + Logout */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search for course..."
              className="border px-3 py-1.5 rounded-2xl pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 text-sm font-medium"
          >
            Log out
          </button>
        </div>
      </div>

      {/* Confirm Logout */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-4">
            <h3 className="text-lg font-semibold">Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed md:sticky top-0 left-0 h-full bg-white shadow-md p-6 w-64 overflow-y-auto transition-transform duration-300 z-40
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        >
          <nav className="space-y-2 text-gray-600 mt-6">
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
                  onClick={() => setSidebarOpen(false)}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </NavLink>
              )
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="px-2 w-full">
          <InstructorTopBar />
          <Outlet />
        </div>
      </div>

      <ToastContainer autoClose={1000} />
    </div>
  );
};

export default InstructorOutlet;
