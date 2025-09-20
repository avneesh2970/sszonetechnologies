import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // optional if you use toast

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    phoneNumb: "",
    skill: "",
    displayNamePubliclyAs: "",
    bio: "",
  });
  const [settingId, setSettingId] = useState(null);

  // Fetch existing settings (GET)
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin-setting`
        );
        if (res.data.success && res.data.data.length > 0) {
          setFormData(res.data.data[0]); // assuming only 1 admin setting
          setSettingId(res.data.data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit (POST if new, PUT if update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (settingId) {
        // Update
        res = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin-setting/${settingId}`,
          formData
        );
      } else {
        // Create
        res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin-setting`,
          formData
        );
        setSettingId(res.data.data._id);
      }

      if (res.data.success) {
        toast.success(res.data.message || "Settings updated!");
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Error saving settings!");
    }
  };

  const [step, setStep] = useState(1); // 1 = verify old password, 2 = enter new password
  const [oldPassword, setOldPassword] = useState("");
  const [newPasswordData, setNewPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Step 1: Verify old password
  const handleVerifyOldPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/verify-password`,
        { oldPassword },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Old password verified!");
        setStep(2); // move to new password step
      } else {
        toast.error(res.data.message || "Invalid old password!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error verifying password");
      console.log("skldkf", err);
    }
  };

  // Step 2: Handle new password input
  const handlePasswordChange = (e) => {
    setNewPasswordData({
      ...newPasswordData,
      [e.target.name]: e.target.value,
    });
  };

  // Step 2: Submit new password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPasswordData.newPassword !== newPasswordData.confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/update-password`,
        {
          oldPassword,
          newPassword: newPasswordData.newPassword,
          confirmPassword: newPasswordData.confirmPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Password updated successfully!");
        setStep(1); // reset to step 1
        setOldPassword("");
        setNewPasswordData({ newPassword: "", confirmPassword: "" });
      } else {
        toast.error(res.data.message || "Failed to update password");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    }
  };

  const tabs = ["profile", "password", "social"];
  const isActive = (tab) =>
    activeTab === tab
      ? "border-b-2 border-blue-500 text-black font-medium"
      : "text-gray-500 hover:text-black";

  return (
    <div className="mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold mb-6">Setting</h1>

      {/* Tab Buttons */}
      <div className="grid grid-cols-3 gap-2 border-b mb-6 justify-center ">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`pb-2 capitalize cursor-pointer text-lg font-semibold ${isActive(
              tab
            )}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "profile"
              ? "Profile"
              : tab === "password"
              ? "Password"
              : "Social Links"}
          </button>
        ))}
      </div>

      {/* FORM */}
      {activeTab === "profile" && (
        <>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Don"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="Johndon01"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumb"
                  value={formData.phoneNumb}
                  onChange={handleChange}
                  placeholder="9999999999"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1">
                  Skill/Occupation
                </label>
                <input
                  type="text"
                  name="skill"
                  value={formData.skill}
                  onChange={handleChange}
                  placeholder="Developer"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1">
                  Display Name Publicly As
                </label>
                <input
                  type="text"
                  name="displayNamePubliclyAs"
                  value={formData.displayNamePubliclyAs}
                  onChange={handleChange}
                  placeholder="John D."
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Add your bio"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 h-24 resize-none`}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mt-5"
            >
              {settingId ? "Update Information" : "Save Information"}
            </button>
          </form>
        </>
      )}

      {activeTab === "password" && (
        <>
          <p className="text-gray-600">Password update logic here...</p>
          <div className="p-6">
            {step === 1 ? (
              // 🔹 Step 1: Verify old password
              <form onSubmit={handleVerifyOldPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">
                    Old Password
                  </label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full mt-1 p-2 border rounded"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Verify Password
                </button>
              </form>
            ) : (
              // 🔹 Step 2: New password inputs
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={newPasswordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full mt-1 p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={newPasswordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full mt-1 p-2 border rounded"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Update Password
                </button>
              </form>
            )}
          </div>
        </>
      )}

      {activeTab === "social" && (
        <p className="text-gray-600">Social links update logic here...</p>
      )}

      <ToastContainer />
    </div>
  );
};

export default AdminSettings;
