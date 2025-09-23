import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useStudentAuth } from "./studentAuth";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaGlobe,
  FaGithub,
} from "react-icons/fa";
import ForgotPasswordModal from "./ResetPassword";

const Settings = () => {
  const { user } = useStudentAuth(); // ✅ you already get logged-in user from cookie/JWT
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    phone: "",
    occupation: "",
    displayName: "",
    bio: "",
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    website: "",
    github: "",
  });
  const [showForgotModal, setShowForgotModal] = useState(false);

  // 🔹 fetch settings for logged-in user
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/studentSettings/me`,
          {
            withCredentials: true, // 🔑 send JWT cookie
          }
        );

        if (res.data.success && res.data.settings) {
          setFormData(res.data.settings);
        }
      } catch (err) {
        toast.warning("No existing settings found, user can create new.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // 🔹 handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // 🔹 save settings (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/studentSettings`,
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Settings saved successfully!");
        setFormData(res.data.settings); // refresh form with updated values
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      toast.error("Failed to save settings");
    }
  };

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [oldVerified, setOldVerified] = useState(false);

  const handleInputChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // Step 1: Verify old password
  const handleVerifyOldPassword = async (e) => {
    e.preventDefault();
    if (!passwords.oldPassword) {
      toast.error("Please enter your old password");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-old-password`,
        { oldPassword: passwords.oldPassword },
        { withCredentials: true }
      );
      setOldVerified(true);
      toast.success("Old password verified. Enter new password now.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Old password incorrect");
    }
  };

  // Step 2: Update new password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/update-password`,
        {
          newPassword: passwords.newPassword,
          confirmPassword: passwords.confirmPassword,
        },
        { withCredentials: true }
      );
      toast.success("Password updated successfully");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setOldVerified(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    }
  };

  const handleCancel = () => {
    setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setOldVerified(false);
  };

  const [activeTab, setActiveTab] = useState("profile");
  const tabs = ["profile", "password", "social"];

  const isActive = (tab) =>
    activeTab === tab
      ? "border-b-2 border-blue-500 text-black font-medium"
      : "text-gray-500 hover:text-black";

  return (
    <div className=" p-6 space-y-6 max-w-4xl ">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      <div className="grid grid-cols-3 gap-2 border-b mb-6 justify-center">
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

      {/* Profile Section */}
      {activeTab === "profile" && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label className="block text-sm font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Occupation</label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Display Name</label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Bio</label>
            <textarea
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              rows="4"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Save Settings
            </button>
          </div>
        </form>
      )}

      {/* Password Section */}
      {activeTab === "password" && (
        <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-lg bg-white">
          <h2 className="text-xl font-bold mb-4">Change Password</h2>

          {!oldVerified ? (
            <form onSubmit={handleVerifyOldPassword}>
              <label className="block mb-2">Old Password</label>
              <input
                type="password"
                name="oldPassword"
                value={passwords.oldPassword}
                onChange={handleInputChange}
                className="w-full border p-2 rounded mb-2"
                required
              />
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-sm text-blue-500 mb-4"
              >
                Forgot Password?
              </button>
              <ForgotPasswordModal
                isOpen={showForgotModal}
                onClose={() => setShowForgotModal(false)}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
                >
                  Verify Old Password
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-400 hover:bg-gray-600 text-white px-4 py-2 rounded cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleUpdatePassword}>
              <label className="block mb-2">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handleInputChange}
                className="w-full border p-2 rounded mb-4"
                required
              />

              <label className="block mb-2">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handleInputChange}
                className="w-full border p-2 rounded mb-4"
                required
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-400 text-white px-4 py-2 rounded cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Social Links Section */}
      {activeTab === "social" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Facebook */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1 flex items-center gap-2">
                <FaFacebook className="text-blue-600" /> Facebook
              </label>
              <input
                type="url"
                name="facebook"
                value={formData.facebook || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="https://facebook.com/"
              />
            </div>

            {/* Instagram */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1 flex items-center gap-2">
                <FaInstagram className="text-pink-500" /> Instagram
              </label>
              <input
                type="url"
                name="instagram"
                value={formData.instagram || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="https://instagram.com/"
              />
            </div>

            {/* Twitter */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1 flex items-center gap-2">
                <FaTwitter className="text-sky-500" /> Twitter
              </label>
              <input
                type="url"
                name="twitter"
                value={formData.twitter || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="https://twitter.com/"
              />
            </div>

            {/* LinkedIn */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1 flex items-center gap-2">
                <FaLinkedin className="text-blue-700" /> LinkedIn
              </label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="https://linkedin.com/"
              />
            </div>

            {/* Website / Portfolio */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1 flex items-center gap-2">
                <FaGlobe className="text-green-600" /> Website/Portfolio
              </label>
              <input
                type="url"
                name="website"
                value={formData.website || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="https://portfolio.com/"
              />
            </div>

            {/* GitHub */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1 flex items-center gap-2">
                <FaGithub className="text-gray-800" /> GitHub
              </label>
              <input
                type="url"
                name="github"
                value={formData.github || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="https://github.com/"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mt-7"
          >
            Update Social Links
          </button>
        </form>
      )}

      <ToastContainer onClose={1000} />
    </div>
  );
};

export default Settings;
