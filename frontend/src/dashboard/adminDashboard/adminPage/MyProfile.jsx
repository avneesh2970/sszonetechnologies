import React, { useEffect, useState } from "react";
import axios from "axios";
import useAdminAuth from "./AdminAuth";

const AdminProfile = () => {
  const { profile, fetchProfile } = useAdminAuth();

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) {
    return <div className="p-6 text-gray-600">Loading profile...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Profile</h2>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="w-48 font-medium text-gray-600">
            Registration Date
          </div>
          <div className="text-gray-800">
            {new Date(profile.createdAt).toLocaleString()}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center">
          <div className="w-48 font-medium text-gray-600">First Name</div>
          <div className="text-gray-800">{profile.firstName}</div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center">
          <div className="w-48 font-medium text-gray-600">Last Name</div>
          <div className="text-gray-800">{profile.lastName}</div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center">
          <div className="w-48 font-medium text-gray-600">Username</div>
          <div className="text-gray-800">{profile.userName}</div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center">
          <div className="w-48 font-medium text-gray-600">Email</div>
          <div className="text-gray-800">{profile.email || "Not Provided"}</div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center">
          <div className="w-48 font-medium text-gray-600">Phone Number</div>
          <div className="text-gray-800">{profile.phoneNumb}</div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center">
          <div className="w-48 font-medium text-gray-600">Expert</div>
          <div className="text-gray-800">{profile.skill}</div>
        </div>

        <div className="flex flex-col md:flex-row md:items-start gap-x-20">
          <div className="w-48 font-medium text-gray-600">Biography</div>
          <div className="text-gray-800">{profile.bio}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
