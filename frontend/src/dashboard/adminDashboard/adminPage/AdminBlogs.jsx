import React, { useState, useEffect } from "react";
import axios from "axios";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import LinkExtension from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
// import CustomMenuBar from "../components/Menu/CustomMenuBar";
import { Link } from "react-router-dom";
import { FaTrash, FaEdit, FaArrowRight } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomMenuBar from "./CustomMenuBar";

const BlogModalPage = () => {
  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    date: getTodayDate(),
    author: "",
    tags: "",
    content: "",
    category: "",
    language: "",
    dribbble: "",
    linkedin: "",
    facebook: "",
    twitter: "",
    review: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [loading, setLoading] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Superscript,
      Subscript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      LinkExtension.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: "Start writing your post here..." }),
    ],
    content: "",
    onUpdate: ({ editor }) =>
      setFormData((prev) => ({ ...prev, content: editor.getHTML() })),
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    document.getElementById("fileUpload").value = "";
  };

  const resetForm = () => {
    setFormData({
      title: "",
      date: getTodayDate(),
      author: "",
      tags: "",
      content: "",
      category: "",
      language: "",
      dribbble: "",
      linkedin: "",
      facebook: "",
      twitter: "",
      review: "",
    });
    setImage(null);
    setImagePreview(null);
    setIsEditing(false);
    setEditingBlogId(null);
    if (editor) editor.commands.setContent("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (image) data.append("image", image);

    try {
      if (isEditing) {
        await axios.put(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/blogs/blogs/${editingBlogId}`,
          data
        );
        toast.success("Blog updated!");
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/blogs`, data);
        toast.success("Blog uploaded!");
      }
      setShowModal(false);
      resetForm();
      fetchBlogs();
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Failed to upload blog.");
    }
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/blogs`
      );
      setBlogs(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/blogs/blogs/${id}`
      );
      toast.success("Blog deleted successfully");
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog.");
    }
  };

  const handleEdit = (blog) => {
    setFormData({
      title: blog.title,
      date: blog.date ? blog.date.split("T")[0] : getTodayDate(),
      author: blog.author,
      tags: blog.tags.join(", "),
      content: blog.content,
      category: blog.category,
      language: blog.language,
      dribbble: blog.dribbble,
      linkedin: blog.linkedin,
      facebook: blog.facebook,
      twitter: blog.twitter,
      review: blog.review || 3,
    });

    // Safe image preview setup
    setImagePreview(
      blog.image
        ? `${import.meta.env.VITE_BACKEND_URL}/${blog.image.replace(
            /\\/g,
            "/"
          )}`
        : null
    );

    setEditingBlogId(blog._id);
    setIsEditing(true);
    setShowModal(true);

    if (editor) editor.commands.setContent(blog.content || "");
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const [allComments, setAllComments] = useState([]);

  const fetchAllComments = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/comment/all`
      );
      if (res.data.success) {
        setAllComments(res.data.comments);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load comments");
    }
  };

  const deleteComment = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/comment/delete/${id}`
      );
      toast.success("Comment deleted");
      setAllComments((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete comment");
    }
  };

  useEffect(() => {
    fetchAllComments();
  }, []);

  return (
    <div className=" min-h-screen">
      <div className="p-3 text-right">
        <button
          onClick={() => setShowModal(true)}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Upload Blog
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
            <button
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">
              {isEditing ? "Edit Blog" : "Upload Blog"}
            </h2>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 max-h-[80vh] overflow-y-auto pr-2"
            >
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                className="w-full p-2 border rounded"
                required
              />
              <div className="flex gap-4">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-1/2 p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Author"
                  className="w-1/2 p-2 border rounded"
                  required
                />
              </div>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Tags (comma-separated)"
                className="w-full p-2 border rounded"
              />
              <input
                type="file"
                accept="image/*"
                id="fileUpload"
                onChange={handleImageChange}
                className="w-full border rounded p-2"
              />
              {imagePreview && (
                <div className="relative mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover border"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Remove
                  </button>
                </div>
              )}
              <div className="border rounded p-2">
                <CustomMenuBar editor={editor} />
                <EditorContent
                  editor={editor}
                  className="prose max-w-none min-h-[150px]"
                />
              </div>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Category"
                className="w-full p-2 border rounded"
              />

              <input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleChange}
                placeholder="Language"
                className="w-full p-2 border rounded"
              />

              <input
                type="number"
                name="review"
                value={formData.review}
                onChange={handleChange}
                placeholder="Review (0-5 or comment)"
                className="w-full p-2 border rounded"
              />

              {/* Social Links */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="LinkedIn URL"
                  className="p-2 border rounded"
                />
                <input
                  type="url"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  placeholder="Twitter URL"
                  className="p-2 border rounded"
                />
                <input
                  type="url"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  placeholder="Facebook URL"
                  className="p-2 border rounded"
                />
                <input
                  type="url"
                  name="dribbble"
                  value={formData.dribbble}
                  onChange={handleChange}
                  placeholder="Dribbble URL"
                  className="p-2 border rounded"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white p-2 rounded"
              >
                {isEditing ? "Update Blog" : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 mb-4">
        <h2 className="text-3xl font-bold text-center mb-8">Blog Posts</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : blogs.length === 0 ? (
          <p className="text-center text-gray-500">No blogs available</p>
        ) : (
          <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-3">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-[#f5f4ef] rounded-xl shadow-lg overflow-hidden border relative border-gray-200"
              >
                <Link
                  to={`/admin/blogdetail/${blog._id}`}
                  state={blog}
                  className="block hover:shadow-xl transition-all"
                >
                  <span className="inline-block border border-black bg-gray-50 px-4 py-1 rounded-full text-sm absolute top-2 left-2 font-medium">
                    {blog.tags[0] || "Blog"}
                  </span>
                  <div className="w-full h-64 ">
                    {blog.image && (
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/${
                          blog.image
                        }`}
                        alt={blog.title}
                        className="w-full h-full "
                      />
                    )}
                  </div>
                </Link>

                <div className="">
                  <div className="px-2 pt-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {blog.title}
                    </h3>

                    <div
                      className="text-md text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html:
                          blog.content?.length > 50
                            ? `${blog.content.slice(0, 50)}...`
                            : blog.content || "No content",
                      }}
                    ></div>

                    <p className="text-sm text-gray-600 mb-1 flex items-center justify-between my-2">
                      {new Date(blog.date).toLocaleDateString()}
                      <span className="text-[#296AD2] flex items-center gap-1">
                        Read More <FaArrowRight />
                      </span>
                    </p>
                  </div>

                  <div className="flex  p-4 justify-end  h-full gap-2 ">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit Blog"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Blog"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">All Blog Comments</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-blue-50 text-left">
                <th className="p-2 border">Blog Title</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                {/* <th className="p-2 border">Phone</th> */}
                <th className="p-2 border">Comment</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {allComments.length > 0 ? (
                allComments.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="p-2 border">{c.blogId?.title || "N/A"}</td>
                    <td className="p-2 border">
                      {c.firstName} {c.lastName}
                    </td>
                    <td className="p-2 border">{c.email}</td>
                    {/* <td className="p-2 border">{c.phone}</td> */}
                    <td className="p-2 border">{c.comment}</td>
                    <td className="p-2 border">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2 border text-center">
                      <button
                        onClick={() => deleteComment(c._id)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-4 text-center">
                    No comments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ToastContainer autoClose={1000} />
    </div>
  );
};

export default BlogModalPage;
