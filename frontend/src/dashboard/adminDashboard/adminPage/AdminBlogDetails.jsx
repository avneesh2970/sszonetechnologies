import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import { useLocation } from "react-router-dom";



const AdminBlogDetailPage = () => {
  const location = useLocation();
  const blog = location.state;
  const [recentblog, setrecentBlogs] = useState([]);

  const fetchtrcentBlogs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/blogs`);
      setrecentBlogs(res.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchtrcentBlogs();
  });
  return (
    <>
      <div className="w-full h-72 md:h-[400px] rounded-xl overflow-hidden max-w-4xl mx-auto">
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}/${blog.image}`}
          alt="Blog Banner"
          className="w-full h-full object-cover "
        />
      </div>
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Main Blog Content */}
        <div className="col-span-2 space-y-6">
          {/* Title & Metadata */}
          <div className="bg-white p-4 ">
            <h1 className="text-2xl font-bold">{blog.title}</h1>
            <div className="flex justify-between  text-gray-600 mt-2">
              <p>
                <span className="font-semibold">Instructors:</span>{" "}
                {blog.author}
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {new Date(blog.date).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white p-4  text-gray-800">
            <div
              className="text-md text-gray-700"
              dangerouslySetInnerHTML={{
                __html: blog.content || "No content",
              }}
            ></div>
          </div>

          {/* Tags & Social */}
          <div className="bg-white p-4 rounded shadow ">
            <div className="flex flex-wrap gap-2">
              <span className="font-semibold">Tags:</span>
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-200 px-2 py-1 rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-4">
              <span className="font-semibold">Social Network:</span>
              <div className="flex items-center space-x-4 mt-2">
                {blog.facebook && (
                  <a
                    href={blog.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFacebook className="text-gray-600 hover:text-blue-600 cursor-pointer text-xl" />
                  </a>
                )}
                {blog.twitter && (
                  <a
                    href={blog.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTwitter className="text-gray-600 hover:text-blue-500 cursor-pointer text-xl" />
                  </a>
                )}
                {blog.instagram && (
                  <a
                    href={blog.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram className="text-gray-600 hover:text-pink-500 cursor-pointer text-xl" />
                  </a>
                )}
                {blog.linkedin && (
                  <a
                    href={blog.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaLinkedin className="text-gray-600 hover:text-blue-700 cursor-pointer text-xl" />
                  </a>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="bg-white rounded shadow p-4 h-fit">
          <h2 className="text-xl font-bold mb-4">Recent Posts</h2>
          {recentblog.slice(0, 2).map((post) => (
            <div
              key={post.id}
              className="flex items-start gap-3 mb-4 border-b pb-3"
            >
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/${post.image}`}
                alt={post.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="flex items-center text-sm text-gray-500 mb-1">
                  <FiCalendar className="mr-1" />{" "}
                  {new Date(blog.date).toLocaleDateString()}
                </p>
                <h4 className="text-md font-medium text-gray-800">
                  {post.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminBlogDetailPage;
