import React from "react";
import { FaStarOfLife } from "react-icons/fa";
import { Link } from "react-router-dom";
import LogoLoop from "./LogoLoop";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
} from "react-icons/si";

const Hero = () => {
  const techLogos = [
    { node: <SiReact />, title: "React", href: "https://react.dev" },
    { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
    {
      node: <SiTypescript />,
      title: "TypeScript",
      href: "https://www.typescriptlang.org",
    },
    {
      node: <SiTailwindcss />,
      title: "Tailwind CSS",
      href: "https://tailwindcss.com",
    },
  ];
  return (
    <>
     <div className="max-w-screen-2xl mx-auto ">
         <div className="flex flex-col-reverse gap-20 md:flex-row items-center px-4 md:px-16 lg:px-20 md:ml-20 mt-12  ">
        {/* Left Content */}
        <div className="max-md:text-center">
          <h5 className="text-4xl md:text-6xl/[76px] font-semibold max-w-xl bg-gradient-to-r from-slate-900 to-[#6D8FE4] text-transparent bg-clip-text">
            Build Skills That Get You Hired
          </h5>

          <p className="text-sm md:text-base max-w-lg mt-6 max-md:px-2 text-slate-600">
            Join a world-class, personalized learning journey built to turn you
            into a high-performing tech professional — and get hired by top
            product companies.
          </p>

          <div className="flex items-center gap-4 mt-6 justify-center md:justify-start">
            <button
              className="px-8 py-3 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 transition-all"
              type="button"
            >
              Get Started
            </button>
            <Link to="/courses">
              <button
                className="px-5 py-3 rounded-md bg-white text-indigo-600 border border-indigo-400 flex items-center gap-2 hover:bg-indigo-600/5 cursor-pointer active:scale-95 transition-all"
                type="button"
              >
                <FaStarOfLife className="text-indigo-600" />
                <span>Our courses</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full md:max-w-xs lg:max-w-lg">
          <img
            className="w-full h-auto rounded-2xl "
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/users-group.png"
            alt="hero"
          />
        </div>
      </div>

      <div className="py-12 h-[100px]  overflow-hidden text-[#454545] max-w-[1350px] mx-auto">
        <LogoLoop
          logos={techLogos}
          speed={120}
          direction="left"
          logoHeight={48}
          gap={40}
          pauseOnHover
          scaleOnHover
          fadeOut
          fadeOutColor="#ffffff"
          ariaLabel="Technology partners"
        />
      </div>
     </div>
    </>
  );
};

export default Hero;
