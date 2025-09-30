import React from "react";
import { Link } from "react-router-dom";

const WhyChooseUs = () => {
  return (
    <section className="bg-[#f9f9f9] max-w-screen-2xl mx-auto ">
      <div className="  px-4 py-16 grid md:grid-cols-2 gap-10 items-center max-w-7xl mx-auto">
        {/* Left: Image */}
        <div className="rounded-2xl overflow-hidden shadow-md">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000"
            alt="Classroom"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right: Content */}
        <div className="space-y-6">
          <p className="text-blue-600 font-medium">Study at your own pace</p>
          <h1 className="text-2xl md:text-5xl font-bold text-gray-900">
            Learn as an individual
          </h1>

          <ul className="space-y-4 text-gray-700">
            <li>Internationally recognized certificates</li>
            <li>Flexible, self-paced learning tailored to your schedule</li>
            <li>Join a global community of learners</li>
          </ul>

          <Link to="/courses">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-md transition">
              Explore Courses
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
