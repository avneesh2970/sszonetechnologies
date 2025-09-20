import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FaLocationDot } from "react-icons/fa6";
import { MdEmail, MdCall } from "react-icons/md";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

const ContactForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      toast.error("First and last name are required");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Phone number must be 10 digits!");
      return;
    }

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email!");
      return;
    }

    if (!subject.trim()) {
      toast.error("Subject is required!");
      return;
    }

    if (!message.trim() || message.length < 10) {
      toast.error("Message should be at least 10 characters long!");
      return;
    }

    const formData = {
      firstName,
      lastName,
      phone,
      email,
      subject,
      address,
      message,
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/contact/contactUs`,
        formData
      );
      toast.success("Message sent successfully!");

      // Clear the form
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      setSubject("");
      setAddress("");
      setMessage("");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Try again!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-8 ">
      {/* Left: Contact Form */}
      <div className="bg-white shadow-md rounded-2xl p-8">
        <h2 className="text-4xl font-bold  mb-2">Send us a message</h2>
        <p className="text-gray-500 mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
          tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-base font-bold  mb-1">First Name</label>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border-b px-2 py-2 w-full focus:outline-none focus:ring-0 focus:border-blue-400"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-base font-bold  mb-1">Last Name</label>
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border-b px-2 py-2 w-full focus:outline-none focus:ring-0 focus:border-blue-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-base font-bold  mb-1">Phone</label>
              <input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border-b px-2 py-2 w-full focus:outline-none focus:ring-0 focus:border-blue-400"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-base font-bold  mb-1">Email</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-b px-2 py-2 w-full focus:outline-none focus:ring-0 focus:border-blue-400"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-base font-bold  mb-1">Subject</label>
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border-b px-2 py-2 w-full focus:outline-none focus:ring-0 focus:border-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-base font-bold  mb-1">
              Address (Optional)
            </label>
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border-b px-2 py-2 w-full focus:outline-none focus:ring-0 focus:border-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-base font-bold  mb-1">Message</label>
            <textarea
              rows="4"
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border-b px-2 py-2 w-full focus:outline-none focus:ring-0 focus:border-blue-400"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-500  hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg w-full  transition-colors duration-200"
          >
            Send Message
          </button>
        </form>
      </div>
      {/* Right: Contact Info */}
      <div className="p-8 ">
        <div>
          <h2 className="text-4xl  font-bold  mb-2">Get in touch</h2>
          <p className="text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
            tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
          </p>
        </div>

        <div className="space-y-8">
          <div className="flex items-start mt-8 gap-4">
            <div className="h-12 w-12 flex justify-center items-center rounded-full bg-blue-200">
              <FaLocationDot className="text-blue-500 text-xl" />
            </div>
            <div>
              <p className="font-medium text-lg">Location</p>
              <p className="text-gray-500">
                Jalan Cempaka Wangi No 22
                <br />
                Jakarta - Indonesia
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-12 w-12 flex justify-center items-center rounded-full bg-blue-200">
              <MdEmail className="text-blue-500 text-xl" />
            </div>
            <div>
              <p className="font-medium text-lg">Email us</p>
              <p className="text-gray-500">
                support@yourdomain.tld
                <br />
                hello@yourdomain.tld
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-12 w-12 flex justify-center items-center rounded-full bg-blue-200">
              <MdCall className="text-blue-500 text-xl" />
            </div>
            <div>
              <p className="font-medium text-lg">Call us</p>
              <p className="text-gray-500">
                +6221.2002.2012
                <br />
                +6221.2002.2013 (Fax)
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="font-bold text-lg text-gray-700 mb-3 mt-8">
            Follow our social media
          </p>
          <div className="flex gap-4 text-white">
            <a
              href="#"
              className="bg-blue-500 hover:bg-blue-600 p-2 rounded-full flex items-center justify-center"
            >
              <FaFacebookF className="text-2xl" />
            </a>
            <a
              href="#"
              className="bg-blue-500 hover:bg-blue-600 p-2 rounded-full flex items-center justify-center"
            >
              <FaInstagram className="text-2xl" />
            </a>
            <a
              href="#"
              className="bg-blue-500 hover:bg-blue-600 p-2 rounded-full flex items-center justify-center"
            >
              <FaTiktok className="text-2xl" />
            </a>
            <a
              href="#"
              className="bg-blue-500 hover:bg-blue-600 p-2 rounded-full flex items-center justify-center"
            >
              <FaYoutube className="text-2xl" />
            </a>
          </div>
        </div>
      </div>
      <ToastContainer />{" "}
    </div>
  );
};

export default ContactForm;
