import React from "react";
import logo from "../../assets/image/Logo.png"

const Certificate = ({
  name = "xyz",
  id = "NN/N/164/970",
  role = "Data Analyst",
  company = "SSZone",
  startDate = "SEPTEMBER 15, 2024",
  endDate = "DECEMBER 15, 2024",
}) => {
  return (
    <div className="flex justify-center items-center bg-gray-200 min-h-screen p-10">
      <div className="relative w-[900px] h-[600px] bg-white shadow-2xl border-8 border-blue-800 rounded-xl overflow-hidden">
        {/* Left Blue Wave */}
        {/* <div className="absolute left-0 top-0 h-full w-[120px] bg-gradient-to-b from-blue-800 to-blue-400"></div> */}

        {/* Header Section */}
        <div className="  text-center mt-2">
          <h2 className="text-4xl font-bold text-blue-800 uppercase tracking-wide">
            Certificate of Completion
          </h2>
        <img src={logo} alt="logo" className="flex justify-center" />
        </div>

        {/* Body Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-10">
          <p className="text-gray-600 text-lg mt-10">This is Presented To</p>
          <h1 className="text-4xl font-bold text-blue-900 mt-2 border-b">{name}</h1>
          <p className="text-sm text-gray-500 mt-1">ID - {id}</p>

          <p className="mt-6 text-gray-700 text-lg leading-relaxed max-w-3xl">
            Has successfully completed internship on{" "}
            <span className="font-semibold">{role}</span> at{" "}
            <span className="font-semibold text-blue-800">{company}</span> for a
            span of three months from{" "}
            <span className="font-semibold">{startDate}</span> to{" "}
            <span className="font-semibold">{endDate}</span>.
          </p>
        </div>

        {/* Footer Section */}
        <div className="absolute bottom-10 flex justify-between w-[80%] left-1/2 -translate-x-1/2 text-center">
          <div>
            <p className="text-sm font-semibold text-gray-700">#StartupIndia</p>
            <p className="text-xs text-gray-500 mt-1">Team Leader</p>
          </div>

          <div className="text-center">
            <p className="font-semibold text-gray-700">Chief Executive Officer</p>
            <p className="text-xs text-gray-500 mt-1">{company}</p>
          </div>
        </div>

        {/* Seal Icon */}
        <div className="absolute right-8 bottom-8">
          <div className="h-20 w-20 rounded-full border-4 border-blue-700 flex items-center justify-center">
            <span className="text-blue-700 font-bold text-lg">Seal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
