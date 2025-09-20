import React from "react";
import img1 from "../../assets/image/img.jpg";
import { FaArrowRight } from "react-icons/fa";
import { PiBookOpenText, PiMedalDuotone } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import useAuth from "./instructorPage/hooks/useAuth";

const InstructorTopBar = () => {
  const { instructor } = useAuth();
  const navigate = useNavigate();

  const handleCreateCourse = () => {
    navigate("/instructor/courses-add-instructor");
  };

  return (
    <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-10 rounded-xl flex flex-wrap md:flex-nowrap justify-between items-center gap-6 mb-6">
      {/* Profile Section */}
      <div className="flex items-center gap-5">
        <p className="rounded-full w-15 h-15 border-2 border-white flex items-center justify-center bg-blue-500 text-white text-xl font-bold">
          {instructor?.name ? instructor.name.slice(0, 2).toUpperCase() : ""}
        </p>

        <div>
          <div className="text-xl font-semibold">
            Hello
          </div>
          <h2 className="text-lg font-semibold pb-2">
            {instructor?.name} {""}
            Instructer{" "}
          </h2>

          
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handleCreateCourse}
        className="px-5 py-2 border border-white rounded-lg flex items-center gap-2 shadow hover:bg-white hover:text-purple-700 transition"
      >
        Create a New Course <FaArrowRight />
      </button>
    </div>
  );
};

export default InstructorTopBar;
