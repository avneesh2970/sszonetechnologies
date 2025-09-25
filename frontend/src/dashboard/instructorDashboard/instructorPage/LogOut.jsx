import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const InstructorLogout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/instructor/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      toast.success("Logged out successfully");
      navigate("/instructor/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <>
      <div className=" w-[50%] h-[50%] flex items-center justify-center bg-gray-100 rounded-2xl mx-auto">
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
              onClick={() => navigate(-1)}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-600 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstructorLogout;
