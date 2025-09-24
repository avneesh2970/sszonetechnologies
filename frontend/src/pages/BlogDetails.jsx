import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ins from "../assets/image/ins.jpg";
import related from "../assets/image/related.jpg";
import BlogCard from "../componant/BlogCard";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTrash,
  FaTwitter,
} from "react-icons/fa";
import axios from "axios";

import { toast } from "react-toastify";
import { FiCalendar } from "react-icons/fi";
import { useStudentAuth } from "../studentDashboard/StudentesPages/studentAuth";
import { ArrowLeft } from "lucide-react";

const BlogDetails = () => {
  // const { blogData, allBlogs } = location.state || {};
  const { user } = useStudentAuth();

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");

  const [allcomment, setAllComment] = useState([]);

  const { id } = useParams(); // <-- if route is /blogs/:id
  const blogId = id;
  const location = useLocation();
  const blog = location.state;
  const navigate = useNavigate()
  // const [recentblog] = useState([]);

  const [recentblogs, setRecentBlogs] = useState([]);

  if (!blog) {
    return <div className="text-center py-10">Blog not found</div>;
  }
  // Fetch all blogs (for recent blogs)

  const fetchRecentBlogs = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/blogs`
      );
      setRecentBlogs(res.data);
      // toast.success("Successfully fetch Blogs");
    } catch (error) {
      console.error("Error fetching blogs:", error);
      // toast.error("Failed to get Blogs");
    }
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  // const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/comment/${blogId}/comments`
      );
      if (response.data.success) {
        setAllComment(response.data.comments);
      } else {
        toast.error("Failed to fetch comments.");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      // toast.error("Something went wrong while fetching comments.");
    }
  };

  useEffect(() => {
    if (blogId) {
      fetchComments();
      fetchRecentBlogs();
      scrollTo(0, 0);
    }
  }, [blogId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const commentData = { firstName, email, comment };

    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email address.");
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/comment/${blogId}/comments`,
        commentData
      );
      toast.success("Comment sent successfully!");
      setComment("");

      await fetchComments(); // ✅ Refresh comments
    } catch (error) {
      console.log("Error to send Comment", error);
      toast.error("Error to send Comment");
    }
  };

  useEffect(() => {
    if (user) {
      setFirstName(user.name || "");

      setEmail(user.email || "");
    }
  }, [user]);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      
        <div className="relative w-full h-64 md:h-96 lg:h-[500px] rounded-2xl overflow-hidden mb-6">
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

        {/* Title & Info */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl  font-bold mb-3 leading-tight text-gray-900">
            {blog.title}
          </h1>
          <div className="flex justify-between ">
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-600">
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
            <div className="flex items-center space-x-4">
              {blog.facebook && (
                <a
                  href={blog.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <FaFacebook className="w-5 h-5" />
                </a>
              )}
              {blog.twitter && (
                <a
                  href={blog.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-colors"
                >
                  <FaTwitter className="w-4 h-4" />
                </a>
              )}
              {blog.instagram && (
                <a
                  href={blog.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600 transition-all"
                >
                  <FaInstagram className="w-4 h-4" />
                </a>
              )}
              {blog.linkedin && (
                <a
                  href={blog.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition-colors"
                >
                  <FaLinkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Article Content */}
            <article className="bg-white rounded-2xl  p-6 md:p-8">
              <div className="prose prose-lg max-w-none">
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: blog.content || "No content available",
                  }}
                />
              </div>
            </article>

            {/* Comments Section */}
            <section className="bg-white rounded-2xl  p-6 md:p-10">
              {!user ? (
                // 🔒 Show login message if not logged in
                <div className="text-center py-10">
                  <p className="text-gray-600 mb-4">
                    Please{" "}
                    <Link
                      to="/login"
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      login
                    </Link>{" "}
                    to post a comment.
                  </p>
                </div>
              ) : (
                // ✅ Show form if logged in
                <form className="space-y-4 mb-4" onSubmit={handleSubmit}>
                  {/* Hidden fields (still included in payload) */}
                  <input type="hidden" value={firstName} />
                  <input type="hidden" value={email} />

                  {/* Comment Input */}
                  <div className="flex items-start gap-3">
                    {/* User Avatar */}
                    <div className="w-10 h-10 rounded-full border border-gray-300 shadow-sm bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                      {user?.name?.slice(0, 1).toUpperCase()}
                    </div>

                    {/* Textarea */}
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      rows="1"
                      className="flex-1 px-4 py-3 border-b border-gray-400 outline-none resize-none placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={!comment}
                      className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                        !comment
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5"
                      }`}
                    >
                      Post
                    </button>
                  </div>
                </form>
              )}
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl  text-gray-400">Comments</h2>
                {allcomment.length > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[2rem] h-8 px-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-200">
                    {allcomment.length}
                  </span>
                )}
              </div>

              {/* Comments List */}
              {allcomment.length > 0 ? (
                <div className="mb-10 max-h-[400px] overflow-y-auto space-y-6 pr-2 scrollbar-thin-custom">
                  {allcomment.map((comment) => (
                    <div
                      key={comment._id}
                      className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        {comment.avatar ? (
                          <img
                            src={comment.avatar}
                            alt="Commenter"
                            className="w-12 h-12 rounded-full object-cover border border-gray-300 shadow-sm"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full border border-gray-300 shadow-sm bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                            {comment.firstName?.slice(0, 1).toUpperCase()}
                          </div>
                        )}

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900 text-base">
                              {comment.firstName}
                            </h4>
                            <span className="text-gray-400">•</span>
                            <time className="text-sm text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </time>
                          </div>
                          <p className="text-gray-700 leading-relaxed text-sm">
                            {comment.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-14 border border-gray-200 rounded-xl mb-10 bg-gray-50">
                  <p className="text-gray-600 font-medium">No comments yet</p>
                  <p className="text-gray-400 text-sm">
                    Be the first to share your thoughts!
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-2xl border border-gray-300 px-6 py-4">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Tags
                </h3>
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
            </div>

            {/* Recent Posts */}
            <div className=" rounded-2xl border border-gray-300 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Recent Posts
              </h3>
              <div className="space-y-6">
                {recentblogs.slice(0, 3).map((recentBlog) => (
                  <Link
                    key={recentBlog.id}
                    to={`/blogs/${recentBlog._id}`}
                    state={recentBlog}
                    className="group block"
                  >
                    <div className="flex gap-4">
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/${
                          recentBlog.image
                        }`}
                        alt={recentBlog.title}
                        className="w-20 h-20 object-cover rounded-lg group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <FiCalendar className="w-3 h-3" />
                          {new Date(recentBlog.date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </div>
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                          {recentBlog.title}
                        </h4>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Blogs */}
        <section className="mt-16 mb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              You Might Also Like
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover more insightful articles and stay informed with our
              latest content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentblogs.slice(0, 3).map((relatedBlog) => (
              <Link
                key={relatedBlog._id}
                to={`/blogs/${relatedBlog._id}`}
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
                        {new Date(relatedBlog.date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </time>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {relatedBlog.title}
                    </h3>

                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {relatedBlog.content
                        ? `${relatedBlog.content
                            .replace(/<[^>]+>/g, "")
                            .slice(0, 120)}...`
                        : "No preview available"}
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
        </section>
      </div>
    </div>
  );
};

export default BlogDetails;
