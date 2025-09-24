import React, { useEffect } from "react";
import useAdminAuth from "./AdminAuth";

const AdminProfile = () => {
  const { profile, fetchProfile } = useAdminAuth();

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <div className="p-6 text-gray-600 text-center">Loading profile...</div>
    );
  }

  const infoItems = [
    { label: "First Name", value: profile.firstName },
    { label: "Last Name", value: profile.lastName },
    { label: "Username", value: profile.userName },
    { label: "Email", value: profile.email || "Not Provided" },
    { label: "Phone Number", value: profile.phoneNumb || "Not Provided" },
    { label: "Expertise", value: profile.skill || "Not Specified" },
    { label: "Registration Date", value: new Date(profile.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
        Admin Profile
      </h2>

      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        {/* Top Section with Avatar + Name */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700 shadow-md">
            {profile.firstName?.charAt(0).toUpperCase()}
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
              className="flex flex-col sm:flex-row sm:items-center gap-2"
            >
              <span className="w-40 font-medium text-gray-600">
                {item.label}
              </span>
              <span className="text-gray-800">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Biography Section */}
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Biography</h4>
          <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4 ">
            {profile.bio || "No biography added yet."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
