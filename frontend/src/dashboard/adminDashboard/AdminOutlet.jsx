import React, { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useNavigate, NavLink, Link } from "react-router-dom";
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
import axios from "axios";

const NAVBAR_HEIGHT_REM = 4; // 4rem = top-16

const AdminOutlet = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/instructor-courses`
        );
        setCourses(res.data.courses || []);
        console.log("admin Course ", res.data.courses);
      } catch (err) {
        console.error("Error fetching courses", err);
      }
    };
    fetchAllCourses();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
const searchRef = useRef(null);

/* filtered list updates whenever courses or searchQuery changes */
const filteredCourseTitles = useMemo(() => {
  const q = String(searchQuery).trim().toLowerCase();
  if (q === "") {
    // decide: return all courses when empty or return []
    // returning all helps the admin quickly pick from list when they focus the input.
    return courses;
  }
  return (courses || []).filter((c) =>
    (c.title || "").toLowerCase().includes(q)
  );
}, [courses, searchQuery]);

/* click-outside handler to close dropdown reliably */
useEffect(() => {
  const onDocMouse = (e) => {
    if (!searchRef.current) return;
    if (!searchRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };
  document.addEventListener("mousedown", onDocMouse);
  return () => document.removeEventListener("mousedown", onDocMouse);
}, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
    toast.success("Logged out successfully");
  };

  const linkClass =
    "flex items-center space-x-2 p-2 rounded hover:bg-blue-100 transition-colors";
  const activeClass = "bg-blue-100 text-blue-600";

  const Sidebar = () => (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Fixed sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-${NAVBAR_HEIGHT_REM}rem)] w-64 bg-white shadow
                    overflow-y-auto transition-transform duration-300 z-50
                    ${
                      sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0`}
      >
        <nav className="space-y-1.5 text-gray-600 p-6 relative">
          <div className="absolute md:hidden right-1">
            <FaTimes
              className="text-gray-600 text-xl cursor-pointer"
              onClick={() => setSidebarOpen(false)}
            />
          </div>
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

          {/* <NavLink
            to="/admin/category"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <MdSettings />
            <span>Category</span>
          </NavLink> */}

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

          <button
            onClick={() => setShowConfirm(true)}
            className={`${linkClass} w-full text-left`}
          >
            <MdLogout />
            <span>Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f3f5f7]">
      {/* Sticky Top Navbar */}
      <div className="border-b bg-white px-6 py-4 shadow flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <FaBars
            className="text-xl text-gray-700 cursor-pointer md:hidden"
            onClick={() => setSidebarOpen(true)}
          />
          <img src={logo} alt="Logo" className="h-10 w-auto" />
        </div>

        <div className="flex items-center space-x-4">
          
          {/* Search + autocomplete */}
<div ref={searchRef} className="relative hidden sm:block w-[320px]">
  <input
    type="text"
    value={searchQuery}
    placeholder="Search…"
    onChange={(e) => {
      setSearchQuery(e.target.value);
      setShowDropdown(true);
    }}
    onFocus={() => setShowDropdown(true)}
    className="w-full border px-3 py-1.5 rounded-md pl-10 focus:outline-none focus:ring-1 focus:ring-blue-500"
  />

  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

  {showDropdown && (
    <div className="absolute left-0 right-0 mt-1 z-50 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
      {filteredCourseTitles.length === 0 ? (
        <div className="p-3 text-sm text-gray-500">No courses found.</div>
      ) : (
        <ul className="divide-y">
          {filteredCourseTitles.map((course, i) => (
            <li key={course._id ?? i} className="px-0">
  <button
    type="button"
    onClick={() => {
      // navigate and pass the course object as state (more explicit & reliable)
      navigate(`/admin/adminCourseDetails/${course._id}`, { state: course });
      setSearchQuery("");
      setShowDropdown(false);
      setSidebarOpen(false); // optional: close sidebar on mobile
    }}
    className="w-full text-left block px-3 py-2 text-sm hover:bg-gray-50"
  >
    {course.title}
  </button>
</li>

          ))}
        </ul>
      )}
    </div>
  )}
</div>


          <button
            className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
            onClick={() => setShowConfirm(true)}
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Layout */}
      <Sidebar />
      <main className="pt-2 px-2 md:ml-64">
        {/* Inner container if you want max width */}
        <div className="max-w-screen-2xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Logout Confirmation (z-50 to sit above sidebar z-50; overlay gets z-50 too) */}
      {showConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/30 z-50"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="rounded-xl shadow-lg p-6 w-[90%] max-w-sm text-center bg-white"
            onClick={(e) => e.stopPropagation()}
          >
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
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOutlet;

// import React, { useState } from "react";
// import { Outlet, useNavigate, NavLink } from "react-router-dom";
// import { FaSearch, FaBars, FaTimes, FaCreditCard } from "react-icons/fa";
// import {
//   MdDashboard,
//   MdMessage,
//   MdRateReview,
//   MdQuiz,
//   MdSettings,
//   MdLogout,
//   MdPerson,
// } from "react-icons/md";
// import { BiBookBookmark } from "react-icons/bi";
// import { toast } from "react-toastify";
// import logo from "../../assets/image/logo.png";

// const AdminOutlet = () => {
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/admin/login");
//     toast.success("Logged out successfully");
//   };

//   const linkClass = "flex items-center space-x-2 p-2 rounded hover:bg-blue-100";
//   const activeClass = "bg-blue-100 text-blue-600";

//   const Sidebar = () => (
//     <aside
//       className={`fixed md:static top-0 left-0 h-full w-64 bg-white shadow p-6 transform
//       ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
//       md:translate-x-0 transition-transform duration-300 z-50`}
//     >
//       <div className="flex justify-between items-center mb-6 md:hidden">
//         <img src={logo} alt="Logo" className="h-10" />
//         <FaTimes
//           className="text-gray-600 text-xl cursor-pointer"
//           onClick={() => setSidebarOpen(false)}
//         />
//       </div>

//       <nav className="space-y-2 text-gray-600">
//         <NavLink
//           to="/admin"
//           end
//           onClick={() => setSidebarOpen(false)}
//           className={({ isActive }) =>
//             `${linkClass} ${isActive ? activeClass : ""}`
//           }
//         >
//           <MdDashboard />
//           <span>Dashboard</span>
//         </NavLink>

//         <NavLink
//           to="/admin/profile"
//           onClick={() => setSidebarOpen(false)}
//           className={({ isActive }) =>
//             `${linkClass} ${isActive ? activeClass : ""}`
//           }
//         >
//           <MdPerson />
//           <span>My Profile</span>
//         </NavLink>

//         <NavLink
//           to="/admin/enrollCourse"
//           onClick={() => setSidebarOpen(false)}
//           className={({ isActive }) =>
//             `${linkClass} ${isActive ? activeClass : ""}`
//           }
//         >
//           <BiBookBookmark />
//           <span>Courses</span>
//         </NavLink>

//         <NavLink
//           to="/admin/message"
//           onClick={() => setSidebarOpen(false)}
//           className={({ isActive }) =>
//             `${linkClass} ${isActive ? activeClass : ""}`
//           }
//         >
//           <MdMessage />
//           <span>Message</span>
//         </NavLink>

//         <NavLink
//           to="/admin/review"
//           onClick={() => setSidebarOpen(false)}
//           className={({ isActive }) =>
//             `${linkClass} ${isActive ? activeClass : ""}`
//           }
//         >
//           <MdRateReview />
//           <span>Reviews</span>
//         </NavLink>

//         <NavLink
//           to="/admin/quizAttempt"
//           onClick={() => setSidebarOpen(false)}
//           className={({ isActive }) =>
//             `${linkClass} ${isActive ? activeClass : ""}`
//           }
//         >
//           <MdQuiz />
//           <span>Quiz Attempt</span>
//         </NavLink>

//         <NavLink
//           to="/admin/category"
//           onClick={() => setSidebarOpen(false)}
//           className={({ isActive }) =>
//             `${linkClass} ${isActive ? activeClass : ""}`
//           }
//         >
//           <MdSettings />
//           <span>Category</span>
//         </NavLink>

//         <NavLink
//           to="/admin/payment"
//           onClick={() => setSidebarOpen(false)}
//           className={({ isActive }) =>
//             `${linkClass} ${isActive ? activeClass : ""}`
//           }
//         >
//           <FaCreditCard />
//           <span>Payment History</span>
//         </NavLink>

//         <NavLink
//           to="/admin/announcement"
//           onClick={() => setSidebarOpen(false)}
//           className={({ isActive }) =>
//             `${linkClass} ${isActive ? activeClass : ""}`
//           }
//         >
//           <FaCreditCard />
//           <span>Announcement</span>
//         </NavLink>

//         <NavLink
//           to="/admin/blogs"
//           onClick={() => setSidebarOpen(false)}
//           className={({ isActive }) =>
//             `${linkClass} ${isActive ? activeClass : ""}`
//           }
//         >
//           <FaCreditCard />
//           <span>Blogs</span>
//         </NavLink>

//         {/* <NavLink
//           to="/admin/approveCourses"
//           onClick={() => setSidebarOpen(false)}
//           className={({ isActive }) =>
//             `${linkClass} ${isActive ? activeClass : ""}`
//           }
//         >
//           <FaCreditCard />
//           <span>Approve Courses</span>
//         </NavLink>  */}

//         <hr className="my-4" />

//         <NavLink
//           to="/admin/setting"
//           onClick={() => setSidebarOpen(false)}
//           className={({ isActive }) =>
//             `${linkClass} ${isActive ? activeClass : ""}`
//           }
//         >
//           <MdSettings />
//           <span>Setting</span>
//         </NavLink>

//         <NavLink
//           to="/admin/logout"
//           onClick={() => setSidebarOpen(false)}
//           className={({ isActive }) =>
//             `${linkClass} ${isActive ? activeClass : ""}`
//           }
//         >
//           <MdLogout />
//           <span>Logout</span>
//         </NavLink>
//       </nav>
//     </aside>
//   );

//   return (
//     <div className="max-w-screen-2xl mx-auto">
//       {/* Top Navbar */}
//       <div className="border-b bg-white px-6 py-4 shadow flex justify-between items-center">
//         <div className="flex items-center space-x-3">
//           <FaBars
//             className="text-xl text-gray-700 cursor-pointer md:hidden"
//             onClick={() => setSidebarOpen(true)}
//           />
//           <img src={logo} alt="Logo" className="h-10 w-auto" />
//         </div>

//         <div className="flex items-center space-x-4">
//           <div className="relative hidden sm:block">
//             <input
//               type="text"
//               placeholder="Search for course..."
//               className="border px-3 py-1 rounded-md pl-10 focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//             <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
//           </div>
//           <button
//             className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
//             onClick={() => setShowConfirm(true)}
//           >
//             Log Out
//           </button>
//         </div>
//       </div>

//       {/* Logout Confirmation */}
//       {showConfirm && (
//         <div className="fixed inset-0 flex justify-center items-center z-100 bg-black/20 ">
//           <div className="rounded-xl shadow-lg p-6 w-[90%] max-w-sm text-center bg-gray-200">
//             <h2 className="text-lg font-semibold mb-4">
//               Are you sure you want to logout?
//             </h2>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={() => {
//                   setShowConfirm(false);
//                   handleLogout();
//                 }}
//                 className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
//               >
//                 Yes
//               </button>
//               <button
//                 onClick={() => setShowConfirm(false)}
//                 className="px-4 py-2 bg-white rounded-lg hover:bg-gray-400"
//               >
//                 No
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="flex">
//         <Sidebar />
//         <div className="px-2 w-full bg-[#f3f5f7] min-h-screen ">
//           {/* <AdminTopBar /> */}
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminOutlet;
