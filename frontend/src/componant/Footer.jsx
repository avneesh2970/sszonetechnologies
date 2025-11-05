import React from "react";
import { FaPhoneAlt, FaYoutube } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { FaFacebookSquare } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { FaDribbble } from "react-icons/fa";
import logo from "../assets/image/Logo34.png";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <div className="text-white pt-8 px-6 md:px-16 lg:px-20  bg-[#002338] mt-10 py-10 max-w-screen-2xl mx-auto">
        <div className="flex flex-wrap justify-between gap-12 md:gap-6">
          <div className="max-w-80">
            <img src={logo} alt="logo" className="mb-4 h-8 md:h-9 " />
            <p className="text-sm">
              Discover the most extraordinary places to stay, from boutique
              hotels to luxury villas and private islands
            </p>
            {/* <div className="flex items-center gap-3 mt-4">
              
              <img src={assets.instagramIcon} alt=""  className="w-6"/>
             
              <img src={assets.facebookIcon} alt="" className="w-6" />
            
              <img src={assets.twitterIcon} alt=""  className="w-6"/>
             
              <img src={assets.linkendinIcon} alt="" className="w-6" />
            </div> */}
          </div>

          <div>
            <p className="text-lg  text-white">Links</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              <li>
                <Link to="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:underline">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:underline">
                  Blogs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-lg  text-white">Contact Us</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              <li>
                <div className="flex items-start space-x-2 mb-2">
                  <FiMapPin classNameName="text-lg" />
                  <span className="text-sm">
                    GMS Road Dehradun, <br />
                    Uttarakhand, India
                  </span>
                </div>
              </li>
              <li>
                <div className="flex items-start space-x-2">
                  <FaPhoneAlt classNameName="text-lg" />
                  <span className="text-sm">+91 897 989 1703</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="max-w-80">
            <p className="text-lg  text-white mb-4">Social Media</p>
            <div className="flex  space-x-3">
              <div className="flex gap-4 text-xl text-gray-600">
                <a href="https://www.facebook.com/sszone.in" target="_blank" rel="noreferrer">
                  <FaFacebookF className="hover:text-blue-600 transition-colors text-white" />
                </a>
                <a
                  href="https://www.instagram.com/sszone_technologies"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaInstagram className="hover:text-pink-500 transition-colors text-white" />
                </a>
                <a
                  href="https://www.youtube.com/@sszonetechnologies"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaYoutube className="hover:text-red-500 transition-colors text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
