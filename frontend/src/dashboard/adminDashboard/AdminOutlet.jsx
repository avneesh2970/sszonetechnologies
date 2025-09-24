import React, { useState } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { FaSearch, FaBars, FaTimes, FaCreditCard } from "react-icons/fa";
import {
  MdDashboard,
  MdMessage,
  MdRateReview,
  MdQuiz,
  MdSettings,
  MdLogout,
  MdPerson,
} from "react-icons/md";
import { BiBookBookmark } from "react-icons/bi";
import { toast } from "react-toastify";
import logo from "../../assets/image/logo.png";

const AdminOutlet = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
    toast.success("Logged out successfully");
  };

  const linkClass = "flex items-center space-x-2 p-2 rounded hover:bg-blue-100";
  const activeClass = "bg-blue-100 text-blue-600";

  const Sidebar = () => (
    <aside
      className={`fixed md:static top-0 left-0 h-full w-64 bg-white shadow p-6 transform 
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
      md:translate-x-0 transition-transform duration-300 z-50`}
    >
      <div className="flex justify-between items-center mb-6 md:hidden">
        <img src={logo} alt="Logo" className="h-10" />
        <FaTimes
          className="text-gray-600 text-xl cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        />
      </div>

      <nav className="space-y-2 text-gray-600">
        <NavLink
          to="/admin"
          end
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <MdDashboard />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/profile"
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <MdPerson />
          <span>My Profile</span>
        </NavLink>

        <NavLink
          to="/admin/enrollCourse"
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <BiBookBookmark />
          <span>Courses</span>
        </NavLink>

        <NavLink
          to="/admin/message"
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <MdMessage />
          <span>Message</span>
        </NavLink>

        <NavLink
          to="/admin/review"
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <MdRateReview />
          <span>Reviews</span>
        </NavLink>

        <NavLink
          to="/admin/quizAttempt"
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <MdQuiz />
          <span>Quiz Attempt</span>
        </NavLink>

        <NavLink
          to="/admin/category"
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <MdSettings />
          <span>Category</span>
        </NavLink>

        <NavLink
          to="/admin/payment"
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <FaCreditCard />
          <span>Payment History</span>
        </NavLink>

        <NavLink
          to="/admin/announcement"
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <FaCreditCard />
          <span>Announcement</span>
        </NavLink>

        <NavLink
          to="/admin/blogs"
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <FaCreditCard />
          <span>Blogs</span>
        </NavLink>
 
        {/* <NavLink
          to="/admin/approveCourses"
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <FaCreditCard />
          <span>Approve Courses</span>
        </NavLink>  */}

        <hr className="my-4" />

        <NavLink
          to="/admin/setting"
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <MdSettings />
          <span>Setting</span>
        </NavLink>

        <NavLink
          to="/admin/logout"
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <MdLogout />
          <span>Logout</span>
        </NavLink>
      </nav>
    </aside>
  );

  return (
    <div className="max-w-screen-2xl mx-auto">
      {/* Top Navbar */}
      <div className="border-b bg-white px-6 py-4 shadow flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <FaBars
            className="text-xl text-gray-700 cursor-pointer md:hidden"
            onClick={() => setSidebarOpen(true)}
          />
          <img src={logo} alt="Logo" className="h-10 w-auto" />
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search for course..."
              className="border px-3 py-1 rounded-md pl-10 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            onClick={() => setShowConfirm(true)}
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Logout Confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 flex justify-center items-center z-100 bg-black/20 ">
          <div className="rounded-xl shadow-lg p-6 w-[90%] max-w-sm text-center bg-gray-200">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  handleLogout();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-white rounded-lg hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        <Sidebar />
        <div className="px-2 w-full bg-[#f3f5f7] min-h-screen ">
          {/* <AdminTopBar /> */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminOutlet;
