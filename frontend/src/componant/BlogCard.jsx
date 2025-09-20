import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Heading from "../pages/Heading";

const BlogCard = () => {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/blogs`
      );
      setBlogs(res.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to get Blogs");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="max-w-screen-2xl mx-auto px-4">
      {/* Heading */}
      <Heading
        title="Our Blogs"
        subTitle="Latest Blogs"
        content="Stay updated with the latest insights, tips, and trends from our
                      expert blog posts"
      />

      {/* Blog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-10 lg:px-20 ">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow flex flex-col p-4 gap-4"
          >
            <Link to={`/blogs/${blog._id}`} state={blog}>
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/${blog.image}`}
                alt={blog.title}
                className="h-60 w-full object-cover rounded-xl mb-2"
              />

              <div className="flex items-center justify-between mb-1">
                {blog.tags?.length > 0 && (
                  <span className="bg-blue-50 px-2 py-1 rounded text-sm">
                    {blog.tags[0]}
                  </span>
                )}
                <p className="text-gray-600 text-sm">
                  {new Date(blog.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              <h1 className="text-xl font-semibold mb-1">{blog.title}</h1>

              <p className="text-gray-600 text-sm">
                {blog.content
                  ? `${blog.content.replace(/<[^>]+>/g, "").slice(0, 50)}...`
                  : "No content"}
              </p>
            </Link>

            <div className="flex justify-between items-center w-full">
              <Link to={`/blogs/${blog._id}`} state={blog}>
                <button className="text-blue-600 font-medium hover:underline">
                  Read More
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogCard;
