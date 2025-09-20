

// pages/instructor/LoginPage.jsx
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const InstructorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/instructor/login`,
        { email, password },
        { withCredentials: true } // 🔑 needed if using cookies
      );

      toast.success("Login Successful ✅");
      navigate("/instructor");

    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed ❌");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-2">Instructor Login</h2>
      <input
        type="email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        placeholder="Email"
        className="border p-2 w-full mb-2"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        placeholder="Password"
        className="border p-2 w-full mb-2"
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 w-full">
        Login
      </button>
      <ToastContainer autoClose={1000} />
    </form>
  );
};

export default InstructorLogin;
