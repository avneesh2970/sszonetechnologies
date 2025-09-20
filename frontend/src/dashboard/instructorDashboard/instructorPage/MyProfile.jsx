import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useAuth from "./hooks/useAuth";
import { FaChevronDown, FaChevronUp, FaExternalLinkAlt } from "react-icons/fa";

const InstructorProfile = () => {
  const [profile, setProfile] = useState(null);
  const {instructor} = useAuth()
  const[openSocial , setOpenSocial] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/setting/profile`, {
          withCredentials: true,
        });
        setProfile(res.data);
      } catch (err) {
        toast.error("Failed to load profile ❌");
      }
    };
    fetchProfile();
  }, []);

  if (!profile) {
    return <div className="p-6 text-gray-600">Loading profile...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Profile Instructor</h2>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="w-48 font-medium text-gray-600">Registration Date</div>
          <div className="text-gray-800">{new Date(profile.createdAt).toLocaleString()} </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center">
          <div className="w-48 font-medium text-gray-600">First Name</div>
          <div className="text-gray-800">{profile.firstName || "N/A"}</div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center">
          <div className="w-48 font-medium text-gray-600">Last Name</div>
          <div className="text-gray-800">{profile.lastName || "N/A"}</div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center">
          <div className="w-48 font-medium text-gray-600">Username</div>
          <div className="text-gray-800">{profile.userName || "N/A"}</div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center">
          <div className="w-48 font-medium text-gray-600">Email</div>
          <div className="text-gray-800">{instructor?.email || "N/A"}</div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center">
          <div className="w-48 font-medium text-gray-600">Phone Number</div>
          <div className="text-gray-800">{profile.phoneNumber || "N/A"}</div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center">
          <div className="w-48 font-medium text-gray-600">Expert</div>
          <div className="text-gray-800">{profile.skill || "N/A"}</div>
        </div>

        <div className="flex flex-col md:flex-row md:items-start ">
          <div className="w-48 font-medium text-gray-600">Biography</div>
          <div className="text-gray-800 ">{profile.bio || "No bio available"}</div>
        </div>
      </div>
      
          <button
            onClick={() => setOpenSocial(!openSocial)}
            className="flex justify-between items-center gap-2  bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            <span>Social Links</span>
            {openSocial ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {openSocial &&  (
            <div className="mt-2 bg-white md:w-100 border rounded-lg shadow p-4 space-y-3">
              {[
                { label: "Facebook", value: profile.facebook },
                { label: "Instagram", value: profile.instagram },
                { label: "Twitter", value: profile.twitter },
                { label: "LinkedIn", value: profile.linkedin },
                { label: "Website/Portfolio", value: profile.website },
                { label: "GitHub", value: profile.github },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="font-medium">{item.label}</span>
                  {item.value ? (
                    <a
                      href={item.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 flex items-center gap-1 hover:underline"
                    >
                      Visit <FaExternalLinkAlt size={12} />
                    </a>
                  ) : (
                    <span>-</span>
                  )}
                </div>
              ))}
            </div>
          )}
    </div>
  );
};

export default InstructorProfile;



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// const InstructorSettings = () => {
//   const [activeTab, setActiveTab] = useState("profile");

//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [userName, setUserName] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [skill, setSkill] = useState("");
//   const [displayNamePubliclyAs, setDisplayNamePubliclyAs] = useState("");
//   const [bio, setBio] = useState("");

//   const validatePhone = (phoneNumber) => /^[0-9]{10}$/.test(phoneNumber);

//   const tabs = ["profile", "password", "social"];

//   const isActive = (tab) =>
//     activeTab === tab
//       ? "border-b-2 border-blue-500 text-black font-medium"
//       : "text-gray-500 hover:text-black";

//   // Fetch profile on mount
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/instructor/profile", {
//           withCredentials: true,
//         });
//         const data = res.data;
//         setFirstName(data.firstName || "");
//         setLastName(data.lastName || "");
//         setUserName(data.userName || "");
//         setPhoneNumber(data.phoneNumber || "");
//         setSkill(data.skill || "");
//         setDisplayNamePubliclyAs(data.displayNamePubliclyAs || "");
//         setBio(data.bio || "");
//       } catch (err) {
//         toast.error("Failed to load profile ❌");
//       }
//     };
//     fetchProfile();
//   }, []);

//   // Submit updated profile
//   const profileSubmit = async (e) => {
//     e.preventDefault();

//     if (!validatePhone(phoneNumber)) {
//       toast.error("Phone number must be 10 digits");
//       return;
//     }

//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/instructor/profile",
//         { firstName, lastName, userName, phoneNumber, skill, displayNamePubliclyAs, bio },
//         { withCredentials: true }
//       );
//       toast.success(res.data.message || "Profile updated successfully ✅");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to update profile ❌");
//     }
//   };

//   return (
//     <div className="mx-auto p-6 space-y-6 max-w-6xl">
//       <h1 className="text-2xl font-semibold mb-6">Settings</h1>

//       {/* Tabs */}
//       <div className="grid grid-cols-3 gap-2 border-b mb-6 justify-center">
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             className={`pb-2 capitalize cursor-pointer text-lg font-semibold ${isActive(tab)}`}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab === "profile"
//               ? "Profile"
//               : tab === "password"
//               ? "Password"
//               : "Social Links"}
//           </button>
//         ))}
//       </div>

//       {/* Profile Section */}
//       {activeTab === "profile" && (
//         <form className="space-y-6" onSubmit={profileSubmit}>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             {/* firstName, lastName, userName, phoneNumber, skill, displayNamePubliclyAs */}
//             {/* (same inputs as you already have, just binding state) */}
//             {/* ... */}
//           </div>

//           <div className="font-medium mb-1">
//             <label className="mb-1">Bio</label>
//             <textarea
//               placeholder="Tell us about yourself"
//               value={bio}
//               onChange={(e) => setBio(e.target.value)}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 h-24 resize-none"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={
//               !firstName || !lastName || !userName || !phoneNumber || !skill || !displayNamePubliclyAs || !bio
//             }
//             className={`px-6 py-2 text-white rounded-md mt-5 ${
//               !firstName || !lastName || !userName || !phoneNumber || !skill || !displayNamePubliclyAs || !bio
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700"
//             }`}
//           >
//             Update Information
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default InstructorSettings;

