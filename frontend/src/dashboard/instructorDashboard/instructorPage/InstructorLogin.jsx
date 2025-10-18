

// // pages/instructor/LoginPage.jsx
// import axios from "axios";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";

// const InstructorLogin = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/instructor/login`,
//         { email, password },
//         { withCredentials: true } // 🔑 needed if using cookies
//       );

//       toast.success("Login Successful ✅");
//       navigate("/instructor");

//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Login failed ❌");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-4 max-w-sm mx-auto">
//       <h2 className="text-xl font-bold mb-2">Instructor Login</h2>
//       <input
//         type="email"
//         value={email}
//         onChange={(e)=>setEmail(e.target.value)}
//         placeholder="Email"
//         className="border p-2 w-full mb-2"
//         required
//       />
//       <input
//         type="password"
//         value={password}
//         onChange={(e)=>setPassword(e.target.value)}
//         placeholder="Password"
//         className="border p-2 w-full mb-2"
//         required
//       />
//       <button type="submit" className="bg-blue-600 text-white px-4 py-2 w-full">
//         Login
//       </button>
//       <ToastContainer autoClose={1000} />
//     </form>
//   );
// };

// export default InstructorLogin;


import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function InstructorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/instructor/login`,
        { email, password },
        { withCredentials: true }
      );

      toast.success(res.data?.message || "Login successful");
      // Small delay so toast is visible
      setTimeout(() => navigate("/instructor"), 800);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl  p-6 sm:p-8">
        <h2 className="text-2xl font-semibold mb-2">Instructor Login</h2>
        <p className="text-sm text-gray-500 mb-4">Welcome back — please login to your instructor account.</p>

        <form onSubmit={handleSubmit} className="space-y-4" aria-label="Instructor login form">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              required
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 p-2"
            />
          </label>

          <label className="block relative">
            <span className="text-sm font-medium text-gray-700">Password</span>
            <div className="mt-1 relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="block w-full rounded-md border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-600 p-2 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 px-2 py-1 rounded hover:bg-gray-100"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-white ${
              loading ? "bg-blue-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 8a1 1 0 011-1h12a1 1 0 011 1v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                <path d="M7 4a3 3 0 016 0v2H7V4z" />
              </svg>
            )}
            <span>{loading ? "Logging in..." : "Login"}</span>
          </button>

          
        </form>

        <ToastContainer position="top-right" autoClose={1500} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

        <div className="mt-6 text-xs text-gray-400 text-center">By logging in you agree to our policies.</div>
      </div>
    </div>
  );
}
