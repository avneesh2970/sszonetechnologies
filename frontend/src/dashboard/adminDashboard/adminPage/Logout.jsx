import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminLogout = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
    toast.success("Logged out successfully");
  };

  return (
    <div>
      {/* Logout Button */}
      <div
        onClick={() => setShowConfirm(true)}
        className="cursor-pointer bg-amber-400 p-3 w-fit rounded-lg"
      >
        Logout
      </div>

      {/* Confirmation Popup */}
      {showConfirm && (
        <div className="fixed inset-0  flex justify-center items-center z-50">
          <div className="bg-gray-200 rounded-xl shadow-lg p-6 w-[90%] max-w-sm text-center">
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
    </div>
  );
};

export default AdminLogout;
