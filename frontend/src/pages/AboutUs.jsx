import React, { useEffect } from "react";
import vodafone from "../assets/image/vodafone.png";
import intel from "../assets/image/intel.png";
import amd from "../assets/image/amd.png";
import talkit from "../assets/image/talkit.png";
import tesla from "../assets/image/tesla.png";
import Infosys from "../assets/image/Infosys.png";
import image1 from "../assets/image/image04.png";
import image2 from "../assets/image/pexels-julia-m-cameron-4144224 1.png";
import { FaStar } from "react-icons/fa6";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import { FaArrowRightLong } from "react-icons/fa6";
import bgImage from "../assets/image/about.jpg";
import learnIcon from "../assets/image/black_board_fill 1.png";
import learnIcon2 from "../assets/image/book_6_fill 1.png";
import learnIcon3 from "../assets/image/mortarboard_fill 1.png";
import learnIcon4 from "../assets/image/certificate_2_fill 1.png";
import LogoLoop from "../componant/LogoLoop";
import {
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import Testimonial from "../componant/Testimonial";
import WhyChooseUs from "../componant/WhyChooseUs";

const features = [
  { icon: learnIcon, text: "Start learning from our experts." },
  { icon: learnIcon2, text: "Enhance your skills with us now." },
  { icon: learnIcon3, text: "Do the professional level Courses." },
  { icon: learnIcon4, text: "Get our verified Certificate." },
];

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

const AboutUs = () => {
  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="max-w-screen-2xl mx-auto">
        <div
          className="h-[60vh] w-full bg-cover bg-center flex items-center "
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className=" p-8 rounded-lg  text-black md:w-1/2 w-full">
            <h1 className="md:text-5xl text-3xl font-bold mb-4">About Us</h1>
            <p className="md:text-lg text-sm leading-relaxed">
              At SSZone Technology, we’re dedicated to empowering learners with
              practical, career-ready skills. We provide flexible, expert-led
              training to help you enhance your expertise and advance your
              career, all at your own pace.
            </p>
          </div>
        </div>

        {/* <div className="py-12 h-[100px]  overflow-hidden text-[#454545] max-w-[1380px] mx-auto">
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
        </div> */}

        {/* <section className="flex flex-col-reverse lg:flex-row items-center justify-between px-7 py-16 max-w-7xl mx-auto gap-28">
        
        <div className="w-full lg:w-1/2">
          <p className="text-sm font-semibold text-blue-600 uppercase mb-2">
            About Us
          </p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Start Learning With Skills <br /> Hunt Now.
          </h2>
          <p className="text-gray-600 mb-8">
            Tap into your full potential with online courses guided by industry
            experts. Master high-demand skills on your schedule and take control
            of your career journey today.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            {features.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <img src={item.icon} alt="icon" className="w-6 h-6" />
                </div>
                <p className="text-gray-800 w-[200px]">{item.text}</p>
              </div>
            ))}
          </div>

          <button className="flex gap-2 items-center bg-blue-700 text-white px-8 py-4 rounded-lg my-4 transition cursor-pointer duration-300 ease-in-out  hover:scale-105">
            Browse Courses <FaArrowRightLong className="text-xl " />
          </button>
        </div>

      
        <div className="w-full lg:w-1/2 relative flex justify-center items-center">
          <div className="absolute top-[-10%] right-20 border-2 border-blue-600 rounded-lg w-54 h-70 z-0 hidden lg:block"></div>
          <div className="absolute top-[-15%] right-18 border-2 border-blue-600 rounded-lg w-54 h-70 z-0 hidden lg:block"></div>

          <img
            src={image1}
            alt="Video Learning"
            className="relative z-10 rounded-lg w-[300px] shadow-lg"
          />
          <img
            src={image2}
            alt="Team Work"
            className="absolute bottom-[-100px] left-[-40px] w-[250px] rounded-lg shadow-lg z-20 hidden lg:block"
          />
        </div>
      </section> */}
        <WhyChooseUs />

        <div className="flex flex-col justify-center items-center gap-6 p-6 my-12">
          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-center max-w-2xl">
            Achieve Your Goal With SSZone Technology
          </h1>
          <p className="text-gray-600 text-center max-w-xl">
            Empowering you with skills and knowledge to turn your goals into
            reality.
          </p>

          {/* Features */}
          <div className="flex flex-col lg:flex-row justify-center items-center gap-6 mt-8">
            {/* Card 1 */}
            <div className="flex flex-col justify-center items-center p-6 gap-4 shadow-lg hover:shadow-2xl transition rounded-2xl bg-white max-w-[260px]">
              <img
                src="https://images.unsplash.com/photo-1596495577886-d920f1fb7238?q=80&w=200"
                alt="High Quality Courses"
                className="size-16 rounded-full object-cover"
              />
              <h2 className="text-lg font-bold text-center">
                High Quality Courses
              </h2>
              <p className="text-center text-sm text-gray-600">
                Expert-designed courses crafted to deliver practical skills and
                real-world knowledge.
              </p>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col justify-center items-center p-6 gap-4 shadow-lg hover:shadow-2xl transition rounded-2xl bg-white max-w-[260px]">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=200"
                alt="Expert Instructors"
                className="size-16 rounded-full object-cover"
              />
              <h2 className="text-lg font-bold text-center">
                Expert Instructors
              </h2>
              <p className="text-center text-sm text-gray-600">
                Learn from industry professionals with real-world experience and
                proven expertise.
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col justify-center items-center p-6 gap-4 shadow-lg hover:shadow-2xl transition rounded-2xl bg-white max-w-[260px]">
              <img
                src="https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?q=80&w=200"
                alt="Certification"
                className="size-16 rounded-full object-cover"
              />
              <h2 className="text-lg font-bold text-center">Certification</h2>
              <p className="text-center text-sm text-gray-600">
                Earn a recognized certificate to showcase your skills and boost
                your career.
              </p>
            </div>
          </div>
        </div>

        <Testimonial />
      </div>
    </>
  );
};

export default AboutUs;
