import React, { useState } from "react";
import { useStudentAuth } from "./studentAuth";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const [showConfirm, setShowConfirm] = useState();
  const { logout } = useStudentAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <>
      <div className="bg-black/20 h-screen flex items-center">
        <div className=" w-[50%] h-[50%] flex items-center justify-center  rounded-2xl mx-auto">
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
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
    </div>
      <ToastContainer />
    </>
  );
};

export default Logout;
