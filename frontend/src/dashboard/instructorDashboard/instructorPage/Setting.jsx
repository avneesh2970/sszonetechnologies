import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaGlobe,
  FaGithub,
} from "react-icons/fa";
import useAuth from "./hooks/useAuth";

const InstructorSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { instructor } = useAuth();

  // 🔹 use single "name" instead of firstName/lastName
  const [name, setName] = useState(instructor?.name || "");
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [skill, setSkill] = useState("");
  const [displayNamePubliclyAs, setDisplayNamePubliclyAs] = useState("");
  const [bio, setBio] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");
  const [github, setGithub] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isOldPasswordValid, setIsOldPasswordValid] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);


  const validatePhone = (phoneNumber) => /^[0-9]{10}$/.test(phoneNumber);

  const tabs = ["profile", "password", "social"];
  const isActive = (tab) =>
    activeTab === tab
      ? "border-b-2 border-blue-500 text-black font-medium"
      : "text-gray-500 hover:text-black";

  // 🔹 Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/setting/profile`,
          { withCredentials: true }
        );
        const data = res.data;

        // setName(instructor?.name || ""); // use name
        setName(data.name || data.instructor?.name || "");

        setUserName(data.userName || "");
        setPhoneNumber(data.phoneNumber || "");
        setSkill(data.skill || "");
        setDisplayNamePubliclyAs(data.displayNamePubliclyAs || "");
        setBio(data.bio || "");
        setFacebook(data.facebook || "");
        setInstagram(data.instagram || "");
        setTwitter(data.twitter || "");
        setLinkedin(data.linkedin || "");
        setWebsite(data.website || "");
        setGithub(data.github || "");
      } catch (err) {
        toast.error("Failed to load profile ❌");
      }
    };
    fetchProfile();
  }, [instructor?.name]);

  // 🔹 Submit profile
  const profileSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhone(phoneNumber)) {
      toast.error("Phone number must be 10 digits");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/setting/profile`,
        {
          name, // send single name
          userName,
          phoneNumber,
          skill,
          displayNamePubliclyAs,
          bio,
        },
        { withCredentials: true }
      );
      toast.success(res.data.message || "Profile updated successfully ✅");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile ❌");
    }
  };

  const socialSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/setting/profile`,
        { facebook, instagram, twitter, linkedin, website, github }, // only socials
        { withCredentials: true }
      );
      toast.success(res.data.message || "Social links updated successfully 🎉");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update social links ❌"
      );
    }
  };

  const checkOldPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/instructor/check-password`,
        {
          oldPassword,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setIsOldPasswordValid(true);
        setMessage("Old password matched, Now set a new password.");
        setIsSuccess(true);
      }
    } catch (err) {
      setIsOldPasswordValid(false);
      setMessage("Old password is incorrect ");
      setIsSuccess(false);
    }
  };

  // Function to update password
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("New passwordssss do not match ");
      return;
    }

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/instructor/update-password`,
        {
          oldPassword,
          newPassword,
          confirmPassword,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setMessage("Password updated successfully ");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsOldPasswordValid(false);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update password ❌");
    }
  };

  return (
    <div className=" p-6 space-y-6 ">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      {/* Tabs */}
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
        <form className="space-y-6" onSubmit={profileSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <input type="hidden" value={name} />

            <div className=" mb-1">
              <label className="mb-1">Username</label>
              <input
                type="text"
                placeholder="Johndon01"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className=" mb-1">
              <label className="mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="123-456-7890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className=" mb-1">
              <label className="mb-1">Skill/Occupation</label>
              <input
                type="text"
                placeholder="Developer"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className=" mb-1">
              <label className="mb-1">Display Name Publicly As</label>
              <input
                type="text"
                placeholder="John Developer"
                value={displayNamePubliclyAs}
                onChange={(e) => setDisplayNamePubliclyAs(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className=" mb-1">
            <label className="mb-1">Bio</label>
            <textarea
              placeholder="Tell us about yourself"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 h-24 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={
              !userName ||
              !phoneNumber ||
              !skill ||
              !displayNamePubliclyAs ||
              !bio
            }
            className={`px-6 py-2 text-white rounded-md mt-5 ${
              !userName ||
              !phoneNumber ||
              !skill ||
              !displayNamePubliclyAs ||
              !bio
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Update Information
          </button>
        </form>
      )}

      {activeTab === "password" && (
  <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
    <h2 className="text-xl font-bold mb-4">Change Password</h2>

    {/* ✅ Success (green) or Error (red) message */}
    {message && (
      <p className={isSuccess ? "text-green-600" : "text-red-500"}>
        {message}
      </p>
    )}

    <form onSubmit={handlePasswordUpdate} className="space-y-4">
      {/* Old Password Input */}
      <div>
        <label className="block">Old Password</label>
        <div className="flex space-x-2">
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
          <button
            type="button"
            onClick={checkOldPassword}
            className="bg-blue-500 text-white px-3 rounded hover:bg-blue-600"
          >
            Verify
          </button>
        </div>
      </div>

      {/* New password fields (only visible if old password is valid) */}
      {isOldPasswordValid && (
        <>
          <div>
            <label className="block">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Update Password
            </button>
            <button
              type="button"
              onClick={() => {
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setIsOldPasswordValid(false);
                setMessage("");
              }}
              className="flex-1 bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </form>
  </div>
)}


      {activeTab === "social" && (
        <form
          onSubmit={socialSubmit}
          className="space-y-4 grid grid-cols-2 gap-4"
        >
          <div className="flex items-center gap-2">
            <FaFacebook className="text-blue-600" />
            <label className="w-24">Facebook</label>
            <input
              type="text"
              placeholder="Facebook Profile URL"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className="flex-1 border rounded p-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <FaInstagram className="text-pink-500" />
            <label className="w-24">Instagram</label>
            <input
              type="text"
              placeholder="Instagram Profile URL"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="flex-1 border rounded p-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <FaTwitter className="text-sky-500" />
            <label className="w-24">Twitter</label>
            <input
              type="text"
              placeholder="Twitter Profile URL"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              className="flex-1 border rounded p-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <FaLinkedin className="text-blue-700" />
            <label className="w-24">LinkedIn</label>
            <input
              type="text"
              placeholder="LinkedIn Profile URL"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="flex-1 border rounded p-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <FaGlobe className="text-green-600" />
            <label className="w-24">Website</label>
            <input
              type="text"
              placeholder="Your Website URL"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="flex-1 border rounded p-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <FaGithub className="text-gray-800" />
            <label className="w-24">Github</label>
            <input
              type="text"
              placeholder="Github Profile URL"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className="flex-1 border rounded p-2"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Social Links
          </button>
        </form>
      )}
      <ToastContainer autoClose={1000} />
    </div>
  );
};

export default InstructorSettings;
