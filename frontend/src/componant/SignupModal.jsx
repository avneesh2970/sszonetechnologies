// src/components/SignupModal.jsx
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin, FaApple, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignupModal = ({onClose}) => {
  const [isOpen, setIsOpen] = useState(false); // 👈 control modal internally
  const [show, setShow] = useState(false);
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`,
        signupData,
        { withCredentials: true }
      );
      toast.success("Signup successful 🎉");
      setSignupData({ name: "", email: "", password: "" });
      onClose() // close modal after success
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed ❌");
    }
  };

  

  return (
    <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <IoClose size={22} />
        </button>

        <h2 className="text-2xl font-semibold mb-2">Create Your Account</h2>
        <h2 className="text-lg text-gray-400 mb-6">
          Start learning by creating your free account
        </h2>

        {/* Social buttons */}
        <div className="space-y-3">
          <button className="w-full border rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-gray-50">
            <FcGoogle size={20} />
            <span className="font-medium">Sign up with Google</span>
          </button>
          <button className="w-full border rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-gray-50">
            <FaLinkedin size={20} className="text-blue-600" />
            <span className="font-medium">Sign up with LinkedIn</span>
          </button>
          <button className="w-full border rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-gray-50">
            <FaApple size={20} className="text-black" />
            <span className="font-medium">Sign up with Apple</span>
          </button>
        </div>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t" />
          <span className="mx-4 text-sm text-gray-400">OR</span>
          <div className="flex-1 border-t" />
        </div>

        {/* Signup form */}
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
              required
              placeholder="Password"
              value={signupData.password}
              onChange={(e) =>
                setSignupData({ ...signupData, password: e.target.value })
              }
              className="border p-2 rounded w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {show ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Sign Up
            </button>
          </div>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          Already have an account?{" "}
          <Link to="/login">
            <span className="text-blue-600 hover:underline cursor-pointer">
              Log In
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupModal;