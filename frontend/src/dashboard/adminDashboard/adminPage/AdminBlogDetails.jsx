import axios from "axios";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FiCalendar } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

const AdminBlogDetailPage = () => {
  const location = useLocation();
  const blog = location.state;
  const [recentBlogs, setRecentBlogs] = useState([]);
  const navigate = useNavigate();

  const fetchRecentBlogs = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/blogs`
      );
      setRecentBlogs(res.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchRecentBlogs();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      {/* Banner */}
      <div className="relative w-full h-64 md:h-96 lg:h-[500px] rounded-2xl overflow-hidden mb-8">
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}/${blog.image}`}
          alt="Blog Banner"
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-2 bg-white/80 hover:bg-white text-gray-800 px-3 py-2 rounded-full shadow-md transition"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Main Blog Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Metadata */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight text-gray-900">
              {blog.title}
            </h1>
            <div className="flex items-center gap-6 text-sm md:text-base text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>
                  {new Date(blog.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <article className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
            <div>
              <style>{`
    .blog-content h1 { font-size: 2.25em; font-weight: 700; margin: 1.5rem 0 1rem; }
    .blog-content h2 { font-size: 1.875em; font-weight: 700; margin: 1.25rem 0 0.875rem; }
    .blog-content h3 { font-size: 1.5em; font-weight: 600; margin: 1rem 0 0.75rem; }
    .blog-content p { margin: 0.75rem 0; line-height: 1.75; }
    .blog-content ul { list-style-type: disc; padding-left: 2rem; margin: 1rem 0; }
    .blog-content ol { list-style-type: decimal; padding-left: 2rem; margin: 1rem 0; }
    .blog-content li { margin: 0.375rem 0; line-height: 1.75; }
    .blog-content blockquote { border-left: 4px solid #3b82f6; padding-left: 1rem; margin: 1.5rem 0; font-style: italic; }
    .blog-content code { background: #f3f4f6; padding: 0.2rem 0.4rem; border-radius: 0.25rem; }
    .blog-content pre { background: #1f2937; color: #f3f4f6; padding: 1rem; border-radius: 0.5rem; margin: 1.5rem 0; }
    .blog-content img { max-width: 50%; border-radius: 0.5rem; margin: 1.5rem 0; }
    .blog-content a { color: #3b82f6; text-decoration: underline; }
  `}</style>

              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </article>
        </div>

        {/* Right Sidebar */}
        <aside className="space-y-6">
          {/* Tags */}
          <div className="rounded-2xl border border-gray-300 px-6 py-4 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Recent Posts */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Recent Posts</h2>
            {recentBlogs.slice(0, 3).map((post) => (
              <div
                key={post._id}
                className="flex items-start gap-3 mb-4 border-b pb-3 last:border-b-0 last:pb-0"
              >
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/${post.image}`}
                  alt={post.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="flex items-center text-sm text-gray-500 mb-1">
                    <FiCalendar className="mr-1" />{" "}
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <h4 className="text-md font-medium text-gray-800">
                    {post.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminBlogDetailPage;
