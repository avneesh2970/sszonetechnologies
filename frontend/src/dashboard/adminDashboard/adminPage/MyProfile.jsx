import React, { useEffect } from "react";
import useAdminAuth from "./AdminAuth";
import { FaEnvelope, FaPhone, FaUserTie, FaCalendarAlt } from "react-icons/fa";

const AdminProfile = () => {
  const { profile, fetchProfile } = useAdminAuth();

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <div className="p-6 text-gray-600 text-center animate-pulse">
        Loading profile...
      </div>
    );
  }

  const infoItems = [
    { label: "First Name", value: profile.firstName || "Not Provided" },
    { label: "Last Name", value: profile.lastName || "Not Provided" },
    { label: "Username", value: profile.userName || "Not Provided" },
    {
      label: "Email",
      value: profile.email || "Not Provided",
      icon: <FaEnvelope className="text-blue-500" />,
    },
    {
      label: "Phone Number",
      value: profile.phoneNumb || "Not Provided",
      icon: <FaPhone className="text-green-500" />,
    },
    {
      label: "Expertise",
      value: profile.skill || "Not Specified",
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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2 text-gray-800 ">
        Admin Profile
      </h2>

      <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100">
        {/* Top Section with Avatar + Name */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-6 mb-8">
          <div className="w-18 h-18 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
            {profile.firstName?.charAt(0).toUpperCase() ||
              profile.userName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {profile.firstName} {profile.lastName}
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
                <span className="font-medium text-gray-800">{item.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Biography Section */}
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            Biography
          </h4>
          <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4 shadow-sm">
            {profile.bio || "No biography added yet."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
