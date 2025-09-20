import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import {
  FaBars,
  FaChevronDown,
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaLinkedin,
  FaApple,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import logo from "../assets/image/logo.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useStudentAuth } from "../studentDashboard/StudentesPages/studentAuth";
import ForgotPasswordModal from "../studentDashboard/StudentesPages/ResetPassword";
// import Signup from "./SignUp";

function Navbaar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [wishlist, setWishlist] = useState([]);

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const { user, setUser, cartItems, logout, fetchWishlist ,wishlistItems } = useStudentAuth();

  const getNavLinkClass = ({ isActive }) =>
    isActive
      ? " font-medium text-base text-[#196AE5]"
      : " hover:text-[#196AE5] font-medium text-base";

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`,
        signupData,
        { withCredentials: true } // ✅ important for cookies
      );
      setUser(res.data.user);
      toast.success("Signup successful 🎉");
      setShowSignup(false);
      setSignupData({ name: "", email: "", password: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed ❌");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        loginData,
        { withCredentials: true }
      );
      setUser(res.data.user);
      toast.success("Login successful ✅");
      setShowLogin(false);
      setLoginData({ email: "", password: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed ❌");
    }
  };

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    fetchWishlist();
  }, []);


  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/courses", label: "Courses" },
    { path: "/about", label: "About Us" },
    { path: "/blogs", label: "Blogs" },
    { path: "/contact", label: "Contact Us" },
  ];

  return (
    <nav className="max-w-screen-2xl mx-auto sticky top-0 z-50 ">
      <div className="h-[70px] flex items-center justify-between px-6 md:px-16 lg:px-20  py-4 bg-white text-gray-900 transition-all shadow ">
        <NavLink to="/" className="flex items-center gap-2">
          <img src={logo} alt="Site Logo" />
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8 md:pl-16">
          {navLinks.map(({ path, label }) => (
            <NavLink key={path} to={path} className={getNavLinkClass}>
              {label}
            </NavLink>
          ))}
        </div>

        {/* Icons & Auth */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Old cart and wishlist */}

          {user ? (
            <>
              <div className="flex gap-5">
                <NavLink
                  to="/wishlist"
                  aria-label="Wishlist"
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                >
                  <div className="relative">
                    <Heart className="w-5 h-5" />
                    {wishlistItems.length > 0 && (
                      <span className="absolute -top-3 -right-3 bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                        {wishlistItems.length}
                      </span>
                    )}
                  </div>
                </NavLink>
                <NavLink
                  to="/cart"
                  aria-label="Cart"
                  className="w-10 h-10  rounded-full flex items-center justify-center"
                >
                  <div className="relative">
                    <ShoppingCart className="w-5 h-5" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-3 -right-2 bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    )}
                  </div>
                </NavLink>
              </div>

              <div className="relative inline-block text-left user-dropdown">
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="cursor-pointer text-sm text-gray-700"
                >
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center uppercase">
                      {user?.name?.charAt(0)}
                    </div>
                  )}
                </div>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        setIsDropdownOpen(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsDropdownOpen(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                    
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* <button
                onClick={() => setShowSignup(true)}
                className="px-4 py-2 border border-primary text-primary rounded-md hover:bg-blue-50"
              >
                Sign up
              </button> */}
              <button
                onClick={() => setShowLogin(true)}
                className="px-6 py-2.5 bg-blue-500 text-white rounded-md"
              >
                Log in
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="lg:hidden" onClick={toggleMenu}>
          {isMenuOpen ? (
            <FaTimes className="h-6 w-6" />
          ) : (
            <FaBars className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white py-2 px-4 flex flex-col gap-3 border-b border-slate-300 ">
          {navLinks.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setIsMenuOpen(false)}
              className={getNavLinkClass}
            >
              {label}
            </NavLink>
          ))}

          {user ? (
            <>
              <div className="flex gap-5 mt-2">
                <NavLink
                  to="/wishlist"
                  aria-label="Wishlist"
                  className={`w-8 h-8  rounded-full flex items-center justify-center   `}
                >
                  <div className="relative">
                    <Heart className="w-5 h-5" />
                    {wishlistItems.length > 0 && (
                      <span className="absolute -top-3 -right-3 bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                        {wishlistItems.length}
                      </span>
                    )}
                  </div>
                </NavLink>
                <NavLink
                  to="/cart"
                  aria-label="Cart"
                  className="w-8 h-8  rounded-full flex items-center justify-center"
                >
                  <div className="relative">
                    <ShoppingCart className="w-5 h-5" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-3 -right-2 bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    )}
                  </div>
                </NavLink>
                {/* </div> */}

                <div className="">
                  <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="cursor-pointer text-sm text-gray-700"
                  >
                    {user?.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center uppercase">
                        {user?.name?.charAt(0)}
                      </div>
                    )}
                  </div>

                  {isDropdownOpen && (
                    <div className="mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                      <p
                        onClick={() => {
                          handleLogout();
                          setIsDropdownOpen(false);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        Logout
                      </p>
                      <p
                        onClick={() => {
                          navigate("/dashboard");
                          setIsDropdownOpen(false);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        Dashboard
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowSignup(true)}
                className="px-4 py-2 border border-primary text-primary rounded-md hover:bg-blue-50"
              >
                Sign up
              </button>
              <button
                onClick={() => setShowLogin(true)}
                className="px-5 py-2 bg-blue-500 text-white rounded-md"
              >
                Log in
              </button>
            </>
          )}
        </div>
      )}

      {showLogin && (
        <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative">
            {/* 🔹 LOGIN FORM */}
            {!showForgot && !showOtp && !showReset && (
              <>
                {/* <h2 className="text-xl font-semibold mb-4">Log In</h2> */}
                <button
                  onClick={() => setShowLogin(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  {" "}
                  <IoClose size={22} />{" "}
                </button>{" "}
                <h2 className="text-2xl font-semibold mb-2">
                  {" "}
                  Welcome Back! Log in to continue{" "}
                </h2>{" "}
                <h2 className="text-base text-gray-400 mb-6">
                  {" "}
                  Resume your learning journey{" "}
                </h2>{" "}
                {/* social logins */}{" "}
                <div className="space-y-3">
                  {" "}
                  <button className="w-full border rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-gray-50">
                    {" "}
                    <FcGoogle size={20} />{" "}
                    <span className="font-medium">Sign in with Google</span>{" "}
                  </button>{" "}
                  <button className="w-full border rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-gray-50">
                    {" "}
                    <FaLinkedin size={20} className="text-blue-600" />{" "}
                    <span className="font-medium">Sign in with LinkedIn</span>{" "}
                  </button>{" "}
                  <button className="w-full border rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-gray-50">
                    {" "}
                    <FaApple size={20} className="text-black" />{" "}
                    <span className="font-medium">Sign in with Apple</span>{" "}
                  </button>{" "}
                </div>{" "}
                <div className="flex items-center my-6">
                  {" "}
                  <div className="flex-1 border-t" />{" "}
                  <span className="mx-4 text-sm text-gray-400">OR</span>{" "}
                  <div className="flex-1 border-t" />{" "}
                </div>
                <form
                  onSubmit={handleLoginSubmit}
                  className="flex flex-col gap-3"
                >
                  <input
                    type="email"
                    required
                    placeholder="Email"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    className="border p-2 rounded"
                  />
                  <div className="relative w-full">
                    <input
                      type={show ? "text" : "password"}
                      placeholder="Password"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      required
                      className="border p-2 rounded w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {show ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-sm text-blue-500 mb-4 text-right"
                  >
                    Forgot Password?
                  </button>
                  <ForgotPasswordModal
                    isOpen={showForgotModal}
                    onClose={() => setShowForgotModal(false)}
                  />
                  <div className="flex justify-between mt-4">
                    {/* <button
                      type="button"
                      onClick={() => setShowLogin(false)}
                      className="text-sm text-gray-500"
                    >
                      Cancel
                    </button> */}
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                    >
                      Log In
                    </button>
                  </div>
                  <p
                    onClick={() => {
                      setShowLogin(false);
                      setShowSignup(true);
                    }}
                    className="text-sm cursor-pointer mt-2 text-center"
                  >
                    Don’t have an account?{" "}
                    <span className="text-blue-500"> Sign up </span>
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative">
            {/* <h2 className="text-xl font-semibold mb-4">Sign Up</h2> */}
            <button
              onClick={() => setShowSignup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              {" "}
              <IoClose size={22} />{" "}
            </button>{" "}
            <h2 className="text-2xl font-semibold mb-2">Create Your Account</h2>{" "}
            <h2 className="text-base text-gray-400 mb-6">
              {" "}
              Start learning by creating your free account{" "}
            </h2>{" "}
            {/* Social buttons */}{" "}
            <div className="space-y-3">
              {" "}
              <button className="w-full border rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-gray-50">
                {" "}
                <FcGoogle size={20} />{" "}
                <span className="font-medium">Sign up with Google</span>{" "}
              </button>{" "}
              <button className="w-full border rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-gray-50">
                {" "}
                <FaLinkedin size={20} className="text-blue-600" />{" "}
                <span className="font-medium">Sign up with LinkedIn</span>{" "}
              </button>{" "}
              <button className="w-full border rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-gray-50">
                {" "}
                <FaApple size={20} className="text-black" />{" "}
                <span className="font-medium">Sign up with Apple</span>{" "}
              </button>{" "}
            </div>{" "}
            <div className="flex items-center my-6">
              {" "}
              <div className="flex-1 border-t" />{" "}
              <span className="mx-4 text-sm text-gray-400">OR</span>{" "}
              <div className="flex-1 border-t" />{" "}
            </div>
            <form onSubmit={handleSignupSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                required
                placeholder="Name"
                value={signupData.name}
                onChange={(e) =>
                  setSignupData({ ...signupData, name: e.target.value })
                }
                className="border p-2 rounded"
              />
              <input
                type="email"
                required
                placeholder="Email"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
                className="border p-2 rounded"
              />
              <div className="relative w-full">
                <input
                  type={show ? "text" : "password"}
                  placeholder="Password"
                  value={signupData.password}
                  onChange={(e) =>
                    setSignupData({ ...signupData, password: e.target.value })
                  }
                  required
                  className="border p-2 rounded w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {show ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="flex  justify-between mt-4">
                {/* <button
                  type="button"
                  onClick={() => setShowSignup(false)}
                  className="text-sm text-gray-500"
                >
                  Cancel
                </button> */}
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                >
                  Sign Up
                </button>
              </div>
              <p
                onClick={() => {
                  setShowSignup(false);
                  setShowLogin(true);
                }}
                className="text-sm  cursor-pointer mt-2 text-center"
              >
                Already have an account?{" "}
                <span className="text-blue-500">Log in </span>
              </p>
            </form>
          </div>
        </div>
      )}
      {/* {showSignup && (
  <Signup onClose={() => setShowSignup(false)} />
)} */}
    </nav>
  );
}

export default Navbaar;
