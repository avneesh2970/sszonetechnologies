 

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useStudentAuth } from "./studentAuth";
import logo from "../../assets/image/logo.png";
import { FaSearch, FaDollarSign, FaRegHeart, FaBookOpen, FaCartPlus } from "react-icons/fa";
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
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";
import { BiBookBookmark ,  BiMessageSquareDetail} from "react-icons/bi";
import StuTopBar from "../stuTopBar";
import { Heart, ShoppingCart } from "lucide-react";
import axios from "axios";
import { useCartContext } from "../../context/CartContext";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [smallMenuOpen, setSmallMenuOpen] = useState(false);
  const { user } = useStudentAuth();
  const navigate = useNavigate();
  const { cartItems , wishlistItems , fetchCartItems, fetchWishlist } = useCartContext();

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchAllCourses = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/instructor-courses`,
          { signal: controller.signal }
        );

        const publishedCourses = (res.data.courses || []).filter(
          (course) => course.status === "Published"
        );

        setCourses(publishedCourses);
      } catch (err) {
        if (err.name === "CanceledError" || err.name === "AbortError") return;
        console.error("Error fetching courses", err);
      }
    };

    fetchAllCourses();
    return () => controller.abort();
  }, []);

  /* ---------- Search & Autocomplete ---------- */
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchRef = useRef(null);

  useEffect(() => {
    const id = setTimeout(
      () => setDebouncedQuery(searchQuery.trim().toLowerCase()),
      200
    );
    return () => clearTimeout(id);
  }, [searchQuery]);

  const filteredCourseTitles = useMemo(() => {
    const q = debouncedQuery;
    if (q === "") {
      return courses || [];
    }
    return (courses || []).filter((c) =>
      (c.title || "").toLowerCase().includes(q)
    );
  }, [courses, debouncedQuery]);

  useEffect(() => {
    setActiveIndex((idx) => {
      if (filteredCourseTitles.length === 0) return -1;
      return Math.max(Math.min(idx, filteredCourseTitles.length - 1), -1);
    });
  }, [filteredCourseTitles]);

  useEffect(() => {
    const onDocMouse = (e) => {
      if (!searchRef.current) return;
      if (!searchRef.current.contains(e.target)) {
        setShowDropdown(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", onDocMouse);
    return () => document.removeEventListener("mousedown", onDocMouse);
  }, []);

  const handleInputKeyDown = (e) => {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filteredCourseTitles.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < filteredCourseTitles.length) {
        const course = filteredCourseTitles[activeIndex];
        if (course) {
          setSearchQuery("");
          setShowDropdown(false);
          setActiveIndex(-1);
          navigate(`/dashboard/stuAllCourse/${course._id}`, { state: course });
        }
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setActiveIndex(-1);
    }
  };

  // click-outside to close the small-screen menu
  const smallMenuRef = useRef(null);
  useEffect(() => {
    const onDoc = (e) => {
      if (!smallMenuRef.current) return;
      if (!smallMenuRef.current.contains(e.target)) {
        setSmallMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const linkClass =
    "flex items-center space-x-2  p-2 rounded hover:bg-blue-100 transition-colors";
  const activeClass = "bg-blue-100 text-blue-600 font-medium rounded-full";

  const sidebarLinks = [
    { to: "/dashboard", icon: <MdDashboard />, label: "Dashboard" },
    {
      to: "/dashboard/enrollCourse",
      icon: <BiBookBookmark />,
      label: "My Courses",
    },
    { to: "/dashboard/allCourse", icon: <FaBookOpen />, label: " All Courses" },
    { to: "/dashboard/myQuiz", icon: <MdQuiz />, label: "My Quiz" },
    { to: "/dashboard/myOrder", icon: <FaDollarSign />, label: "My Order" },
    { to: "/dashboard/profile", icon: <MdPerson />, label: "My Profile" },
    { to: "/dashboard/review", icon: <MdRateReview />, label: "Reviews" },
    { isDivider: true },
    { to: "/dashboard/setting", icon: <MdSettings />, label: "Settings" },
    { to: "/dashboard/logout", icon: <MdLogout />, label: "Logout" },
  ];

  const navLinks = [
    // { to: "/dashboard/wishlist", icon: <FaRegHeart />, label: "Wishlist" },
    { to: "/dashboard/message", icon: < BiMessageSquareDetail />, label: "Messages" },
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
          {/* Search + autocomplete */}
          <div ref={searchRef} className="relative hidden sm:block w-[320px]">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search…"
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
                setActiveIndex(-1);
              }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleInputKeyDown}
              className="w-full border px-3 py-1.5 rounded-md pl-10 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-autocomplete="list"
              aria-expanded={showDropdown}
              aria-controls="course-search-list"
              aria-activedescendant={
                activeIndex >= 0 ? `course-item-${activeIndex}` : undefined
              }
            />

            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            {showDropdown && (
              <div className="absolute left-0 right-0 mt-1 z-50 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredCourseTitles.length === 0 ? (
                  <div className="p-3 text-sm text-gray-500">No courses found.</div>
                ) : (
                  <ul id="course-search-list" className="divide-y">
                    {filteredCourseTitles.map((course, i) => (
                      <li key={course._id ?? i} className="px-0">
                        <Link
                          to={`/dashboard/stuAllCourse/${course._id}`}
                          state={course}
                          onClick={() => {
                            setSearchQuery("");
                            setShowDropdown(false);
                          }}
                          id={`course-item-${i}`}
                          className={`block px-3 py-2 text-sm hover:bg-gray-50 ${
                            i === activeIndex ? "bg-gray-100" : ""
                          }`}
                        >
                          {course.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* ---------- Desktop / md+ icons (kept as-is) ---------- */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink
              to="/dashboard/cart"
              className={({ isActive }) =>
                `relative p-2 rounded ${isActive ? activeClass : " "}`
              }
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </NavLink>  

            <NavLink
              to="/dashboard/wishlist"
              className={({ isActive }) =>
                `relative p-2 rounded ${isActive ? activeClass : " "}`
              }
            >
              <FaRegHeart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1 bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </NavLink>

            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end
                  className={({ isActive }) =>
                    `flex items-center justify-center p-2 rounded-full transition-colors duration-200 
                      hover:text-blue-600 hover:bg-blue-50 text-xl 
                      ${isActive ? " bg-blue-100 text-blue-600" : ""}`
                  }
                >
                  {link.icon}
                </NavLink>
              ))}
            </div>
          </div>

          

          <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 text-sm font-medium w-9 h-9 flex items-center justify-center">
            {user?.name ? user.name.slice(0, 1).toUpperCase() : "NA"}
          </button> 

          {/* ---------- Small screen dropdown button ---------- */}
          <div className="md:hidden relative" ref={smallMenuRef}>
            <button
              onClick={() => setSmallMenuOpen((s) => !s)}
              className="flex items-center gap-1 px-2 py-1 rounded-full hover:bg-gray-100 focus:outline-none"
              aria-expanded={smallMenuOpen}
              aria-haspopup="true"
            >
              {/* show cart icon small + down arrow */}
              {/* <ShoppingCart className="w-5 h-5" /> */}
              <span className="sr-only">Open quick menu</span>
              {smallMenuOpen ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
            </button>

            {smallMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <ul>
                  <li>
                    <NavLink
                      to="/dashboard/wishlist"
                      onClick={() => setSmallMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50"
                    >
                      <FaRegHeart />
                      <span>Wishlist</span>
                      {wishlistItems.length > 0 && (
                        <span className="absolute right-3 top-2 bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                          {wishlistItems.length}
                        </span>
                      )}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/cart"
                      onClick={() => setSmallMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 relative"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Cart</span>
                      {cartItems.length > 0 && (
                        <span className="absolute right-3 top-2 bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                          {cartItems.length}
                        </span>
                      )}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/message"
                      onClick={() => setSmallMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50"
                    >
                      <MdMessage />
                      <span>Messages</span>
                    </NavLink>
                  </li>
                </ul>
              </div>
            )}
          </div>


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
          className={`fixed left-0 top-16
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
          <Outlet />
        </main>
      </div>

      <ToastContainer autoClose={1000} />
    </>
  );
};

export default Dashboard;
