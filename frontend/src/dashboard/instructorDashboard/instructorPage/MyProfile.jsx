import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useAuth from "./hooks/useAuth";
import {
  FaChevronDown,
  FaChevronUp,
  FaExternalLinkAlt,
  FaFacebook,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { FaEnvelope, FaPhone, FaUserTie, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const InstructorProfile = () => {
  const [profile, setProfile] = useState(null);
  const { instructor } = useAuth();
  const [openSocial, setOpenSocial] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/setting/profile`,
          {
            withCredentials: true,
          }
        );
        setProfile(res.data);
      } catch (err) {
        toast.error("Failed to load profile ❌");
      }
    };
    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-lg text-gray-600 mb-4">
          No profile settings available yet.
        </p>
        <button
          onClick={() => navigate("/instructor/setting")}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md 
                     hover:bg-blue-700 transition-colors"
        >
          + Add Setting
        </button>
      </div>
    );
  }

  const infoItems = [
    { label: "Name", value: profile.name || "Not Provided" },
    
    { label: "Username", value: profile.userName || "Not Provided" },
    {
      label: "Email",
      value: instructor?.email || "Not Provided",
      icon: <FaEnvelope className="text-blue-500" />,
    },
    {
      label: "Phone Number",
      value: profile.phoneNumber || "Not Provided",
      icon: <FaPhone className="text-green-500" />,
    },
    {
      label: "Expertise",
      value: profile.skill || "Not Specified",
      icon: <FaUserTie className="text-purple-500" />,
    },
    {
      label: "Biography",
      value: profile.bio || "No biography added yet.",
      icon: <FaUserTie className="text-purple-500" />,
    },
    {
      label: "Registration Date",
      value: new Date(profile.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      icon: <FaCalendarAlt className="text-orange-500" />,
    },
  ];

  const socialLinks = [
    {
      label: "Facebook",
      value: profile.facebook,
      icon: <FaFacebook className="text-blue-600 w-8 h-8" />,
    },
    {
      label: "Instagram",
      value: profile.instagram,
      icon: <FaInstagram className="text-pink-500 w-8 h-8" />,
    },
    {
      label: "Twitter",
      value: profile.twitter,
      icon: <FaTwitter className="text-sky-500 w-8 h-8" />,
    },
    {
      label: "LinkedIn",
      value: profile.linkedin,
      icon: <FaLinkedin className="text-blue-700 w-8 h-8" />,
    },
    {
      label: "Website/Portfolio",
      value: profile.website,
      icon: <FaGlobe className="text-green-600 w-8 h-8" />,
    },
    {
      label: "GitHub",
      value: profile.github,
      icon: <FaGithub className="text-gray-800 w-8 h-8" />,
    },
    
  ];

  return (
    <>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800 ">
          Admin Profile
        </h2>

        <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100">
          {/* Top Section with Avatar + Name */}
          <div className="flex flex-col md:flex-row md:items-center md:gap-6 mb-8">
            <div className="w-18 h-18 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
              {profile.name?.charAt(0).toUpperCase() ||
                profile.userName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {profile.name} 
              </h3>
              <p className="text-gray-500 text-sm">@{profile.userName}</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {infoItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 transition rounded-lg p-3 shadow-sm"
              >
                {item.icon && <div className="text-lg">{item.icon}</div>}
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">{item.label}</span>
                  <span className="font-medium text-gray-800">
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
            <button
              onClick={() => setOpenSocial(!openSocial)}
              className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 transition rounded-lg p-3 shadow-sm border border-gray-400"
            >
              <span>Social Links</span>
              {openSocial ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>

          {/* Biography Section */}
          {/* <div className="mt-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Biography
            </h4>
            <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4 shadow-sm">
              {profile.bio || "No biography added yet."}
            </p>
          </div> */}
        </div>

        {openSocial && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80 md:w-100 text-center relative">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Social Links
              </h3>
              
              <div className="flex flex-wrap justify-center gap-5">
                {socialLinks.map(
                  (item, idx) =>
                    item.value && (
                      <a
                        key={idx}
                        href={item.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:scale-110 transition transform"
                        title={item.label}
                      >
                        {item.icon}
                      </a>
                    )
                )}
              </div>
              <button
                onClick={() => setOpenSocial(false)}
                className="mt-6 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default InstructorProfile;
