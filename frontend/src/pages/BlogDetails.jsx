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

const BlogDetails = () => {
  // const { blogData, allBlogs } = location.state || {};

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [agree, setAgree] = useState(false);
  const [allcomment, setAllComment] = useState([]);

  const { id } = useParams(); // <-- if route is /blogs/:id
  const blogId = id;
  const location = useLocation();
  const blog = location.state;
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
      toast.success("Successfully fetch Blogs");
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to get Blogs");
    }
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);

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
      toast.error("Something went wrong while fetching comments.");
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
    const commentData = { firstName, lastName, phone, email, comment };

    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email address.");
    }
    if (!validatePhone(phone)) {
      return toast.error("Please enter a valid 10-digit phone number.");
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/comment/${blogId}/comments`,
        commentData
      );
      toast.success("Comment sent successfully!");
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      setComment("");
      setAgree(false);

      await fetchComments(); // ✅ Refresh comments
    } catch (error) {
      console.log("Error to send Comment", error);
      toast.error("Error to send Comment");
    }
  };


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl">
      {/* Banner */}
      <div className="w-full h-72 md:h-[450px] rounded-xl overflow-hidden max-w-6xl mx-auto">
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
                  className="bg-blue-50 px-2 py-1 rounded text-sm"
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
          {recentblogs.slice(0, 2).map((blog) => (
            <div
              key={blog.id}
              className="flex items-start gap-3 mb-4 border-b pb-3"
            >
              <Link to={`/blogs/${blog._id}`} state={blog}>
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/${blog.image}`}
                  alt={blog.title}
                  className="w-16 h-16 object-cover rounded"
                />{" "}
              </Link>
              <div>
                <p className="flex items-center text-sm text-gray-500 mb-1">
                  <FiCalendar className="mr-1" />{" "}
                  {new Date(blog.date).toLocaleDateString()}
                </p>
                <h4 className="text-md font-medium text-gray-800">
                  {blog.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Related Blogs */}
      <div className="mt-12 px-5">
        <h2 className="text-2xl font-bold mb-6">Related Blogs</h2>
        
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {recentblogs.slice(0 , 2).map((blog) => (
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

      {/* Comments Section */}
      <section className="space-y-6 mt-12 px-5 py-6 bg-gray-50">
        <h2 className="text-2xl font-bold">
          Comments {allcomment.length > 0 ? allcomment.length : ""}
        </h2>

        <div className="max-w-full overflow-x-auto flex space-x-4 py-4 px-2 border border-gray-200 rounded-md bg-white">
          {allcomment.length > 0 ? (
            <>
              {allcomment.map((comment) => (
                <div
                  key={comment._id}
                  className="min-w-[300px] max-w-xs flex-shrink-0 bg-gray-50 p-4 rounded-xl shadow relative"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={comment.avatar || related}
                      alt="Commenter"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">
                        {comment.firstName} {comment.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700">{comment.comment}</p>
                  {/* <button
                    onClick={() => deleteComment(comment._id)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <FaTrash />
                  </button> */}
                </div>
              ))}
            </>
          ) : (
            <>
              <p className="mx-auto font-semibold">Not Comments Yet!</p>
            </>
          )}
        </div>

        {/* Comment Form */}
        <form className="bg-white p-6 rounded-xl shadow space-y-4 md:w-1/2">
          <h3 className="text-xl font-bold">Leave a Comment</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your First Name"
                className="w-full rounded border px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your Last Name"
                className="w-full rounded border px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Email"
                className="w-full rounded border px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Phone Number</label>
              <input
                type="number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your Phone Number"
                className="w-full rounded border px-3 py-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your comment here..."
                className="w-full rounded border px-3 py-2 h-24 resize-none"
              ></textarea>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <label className="text-sm text-gray-700">
              I agree that my data is collected and stored
            </label>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={
              !firstName || !lastName || !email || !phone || !comment || !agree
            }
            className={`px-6 py-2 rounded text-white ${
              !firstName || !lastName || !email || !phone || !comment || !agree
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Post Comment
          </button>
        </form>
      </section>
    </div>
  );
};

export default BlogDetails;
