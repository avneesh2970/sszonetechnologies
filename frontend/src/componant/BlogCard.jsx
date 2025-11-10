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
    <div className="max-w-screen-2xl mx-auto mb-4">
      {/* Heading */}
      <Heading
        title="Our Blogs"
        subTitle="Latest Blogs"
        content="Stay updated with the latest insights, tips, and trends from our
                      expert blog posts"
      />

      {/* Blog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-10 lg:px-20 ">
        {blogs.map((relatedBlog) => (
          <Link
            key={relatedBlog._id}
            // to={`/blogs/${relatedBlog._id}`}
            to={`/blogs/${relatedBlog.title.toLowerCase().replace(/\s+/g, '-')}`}
            // title.toLowerCase().replace(/\s+/g, '-'); 
            state={relatedBlog}
            className="group"
          >
            <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative overflow-hidden">
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/${
                    relatedBlog.image
                  }`}
                  alt={relatedBlog.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  {relatedBlog.tags?.length > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {relatedBlog.tags[0]}
                    </span>
                  )}
                  <time className="text-sm text-gray-500">
                    {new Date(relatedBlog.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {relatedBlog.title}
                </h3>

                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {relatedBlog.content
                    ? `${relatedBlog.content
                        .replace(/<[^>]+>/g, "")
                        .slice(0, 120)}...`
                    : "No preview available"} . . . 
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-medium group-hover:underline">
                    Read More →
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogCard;
