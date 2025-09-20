import React, { useEffect } from "react";
import img1 from "../../assets/image/img.jpg";
import { FaStar, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import useAdminAuth from "./adminPage/AdminAuth";

const AdminTopBar = () => {
  const {fetchAllReviews, averageRating , allReviews , profile , fetchProfile } = useAdminAuth();
   
  useEffect(()=>{
    fetchAllReviews();
    fetchProfile();
  }, [])

  return (
    <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-8 rounded-xl mb-6 max-w-screen-2xl mx-auto">
      <div className="flex flex-col md:flex-row  items-center md:gap-48">

        {/* Profile Section */}
        <div className="flex items-center gap-4 text-center md:text-left">
          <img
            src={img1}
            alt="Profile"
            className="rounded-full w-20 h-20 border-4 border-white"
          />
          <div>
            <p className="text-sm">Hello</p>
            <h2 className="md:text-xl font-semibold">{profile?.firstName}</h2>
          </div>
        </div>

        {/* Review Section */}
        <div className="flex items-center gap-2 text-lg">
          <FaStar className="text-yellow-300" />
          <span>{averageRating} ({allReviews?.length || "4"} Reviews)</span>
        </div>

        {/* Create Button */}
        {/* <Link to="/admin/courses-add" className="w-full md:w-auto">
          <button className="w-full md:w-auto text-white px-4 py-2 rounded-lg shadow flex justify-center items-center gap-2 border border-white bg-opacity-20 hover:bg-white hover:text-blue-700 transition">
            Create a New Course <FaArrowRight />
          </button>
        </Link> */}
      </div>
    </div>
  );
};

export default AdminTopBar;
