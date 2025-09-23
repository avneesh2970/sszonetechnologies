

import React, { useEffect, useState } from "react";
import bgImage from "../assets/image/blog.jpg";
import blogimg from "../assets/image/card.jpg";
import BlogCard from "../componant/BlogCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Heading from "./Heading";

export const Blog = () => {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/blogs`
      );
      setBlogs(res.data);
      // toast.success("Successfully fetch Blogs");
    } catch (error) {
      console.error("Error fetching blogs:", error);
      // toast.error("Failed to get Blogs");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  return (
    <>
      <div
        className="h-[60vh] w-full bg-cover bg-center flex items-center max-w-screen-2xl mx-auto"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className=" p-8 rounded-lg  text-black md:w-1/2 w-full">
          <h1 className="md:text-5xl text-3xl font-bold mb-4">Blog</h1>
          <p className="md:text-lg text-sm leading-relaxed">
            Discover helpful articles, expert tips, and the latest trends in
            online learning. Stay informed and inspired as you grow your skills
            and career.
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center py-6  justify-center   ">
        <BlogCard />
      </div>
      <ToastContainer autoClose={1000} />
    </>
  );
};

export default Blog;
