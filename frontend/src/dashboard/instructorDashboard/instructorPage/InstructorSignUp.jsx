// import axios from "axios";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const InstructorSignUp = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/instructor/signup`,
//         { name, email, password },
//         { withCredentials: true }
//       );

//       alert(res.data.message);
//       navigate("/instructor/login");
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Signup failed");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-4 max-w-sm mx-auto">
//       <h2 className="text-xl font-bold mb-2">Instructor 5    Signup</h2>
//       <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="border p-2 w-full mb-2" />
//       <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border p-2 w-full mb-2" />
//       <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="border p-2 w-full mb-2" />
//       <button className="bg-green-600 text-white px-4 py-2 w-full">Sign Up</button>
//     </form>
//   );
// };

// export default InstructorSignUp;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function InstructorSignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const validate = () => {
    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return false;
    }
    // simple email check
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    if (!re.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    setError("");
    return true;
  };

  const passwordStrength = (pw) => {
    if (!pw) return "";
    if (pw.length < 6) return "Weak";
    if (pw.length < 10) return "Medium";
    return "Strong";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/instructor/signup`,
        { name, email, password },
        { withCredentials: true }
      );

      setSuccess(res.data?.message || "Signed up successfully");
      setError("");
      // small delay so user can read the success message
      // setTimeout(() => navigate("/instructor/login"), 900);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl  p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          
          <div>
            <h1 className="text-2xl font-semibold">Instructor Signup</h1>
            <p className="text-sm text-gray-500">Create your instructor account to start publishing courses.</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 p-2 rounded">{error}</div>
        )}

        {success && (
          <div className="mb-4 text-sm text-green-800 bg-green-50 border border-green-100 p-2 rounded">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" aria-label="Instructor signup form">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Full Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-2 focus:ring-teal-300 p-2"
              aria-required="true"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-2 focus:ring-teal-300 p-2"
              aria-required="true"
            />
          </label>

          <label className="block relative">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Password</span>
              <span className="text-xs text-gray-500">{passwordStrength(password)}</span>
            </div>
            <div className="mt-1 relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a secure password"
                className="block w-full rounded-md border-gray-200 shadow-sm focus:ring-2 focus:ring-teal-300 p-2 pr-12"
                aria-required="true"
                aria-describedby="password-strength"
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

          <div className="flex items-center gap-3">
            <input
              id="terms"
              type="checkbox"
              required
              className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">I agree to the platform <Link to="/terms" className="text-teal-600 underline">terms</Link></label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-white ${
              loading ? "bg-teal-300 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"
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
                <path d="M10 2a2 2 0 00-2 2v2H6a2 2 0 00-2 2v4h12V8a2 2 0 00-2-2h-2V4a2 2 0 00-2-2z" />
              </svg>
            )}
            <span>{loading ? "Signing up..." : "Create account"}</span>
          </button>

          
        </form>

        <div className="mt-6 text-xs text-gray-400 text-center">By creating an account you agree to our policies.</div>
      </div>
    </div>
  );
}
