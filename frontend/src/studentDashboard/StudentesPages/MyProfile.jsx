import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronUp, FaExternalLinkAlt } from "react-icons/fa";

const Profile = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [openSocial, setOpenSocial] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/studentSettings/me`,
          { withCredentials: true }
        );

        if (res.data.success && res.data.settings) {
          setSettings(res.data.settings);
        }
      } catch (err) {
        toast.warning("No existing settings found, user can create new.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-600">Loading profile...</div>;
  }

  // 👉 When no settings are available
  if (!settings) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-lg text-gray-600 mb-4">
          No profile settings available yet.
        </p>
        <button
          onClick={() => navigate("/dashboard/setting")}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md 
                     hover:bg-blue-700 transition-colors"
        >
          + Add Setting
        </button>
      </div>
    );
  }

  // 👉 Show settings in label-value (2-column) style
  return (
    <>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
          Profile
        </h2>

        <div className="bg-white shadow-md rounded-xl p-6 space-y-5">
          {/* First Name */}
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="w-48 font-medium text-gray-600">First Name</div>
            <div className="text-gray-800">{settings.firstName || "-"}</div>
          </div>

          {/* Last Name */}
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="w-48 font-medium text-gray-600">Last Name</div>
            <div className="text-gray-800">{settings.lastName || "-"}</div>
          </div>

          {/* Username */}
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="w-48 font-medium text-gray-600">Username</div>
            <div className="text-gray-800">{settings.username || "-"}</div>
          </div>

          {/* Display Name */}
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="w-48 font-medium text-gray-600">Display Name</div>
            <div className="text-gray-800">{settings.displayName || "-"}</div>
          </div>

          {/* Phone */}
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="w-48 font-medium text-gray-600">Phone Number</div>
            <div className="text-gray-800">{settings.phone || "-"}</div>
          </div>

          {/* Occupation */}
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="w-48 font-medium text-gray-600">Occupation</div>
            <div className="text-gray-800">{settings.occupation || "-"}</div>
          </div>

          {/* Biography */}
          <div className="flex flex-col md:flex-row md:items-start ">
            <div className="w-48 font-medium text-gray-600">Biography</div>
            <div className="text-gray-800 leading-relaxed whitespace-pre-line">
              {settings.bio || "-"}
            </div>
          </div>

          <button
            onClick={() => setOpenSocial(!openSocial)}
            className="flex justify-between items-center gap-2  bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            <span>Social Links</span>
            {openSocial ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {openSocial && settings && (
            <div className="mt-2 bg-white md:w-100 border rounded-lg shadow p-4 space-y-3">
              {[
                { label: "Facebook", value: settings.facebook },
                { label: "Instagram", value: settings.instagram },
                { label: "Twitter", value: settings.twitter },
                { label: "LinkedIn", value: settings.linkedin },
                { label: "Website/Portfolio", value: settings.website },
                { label: "GitHub", value: settings.github },
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
      </div>
    </>
  );
};

export default Profile;
