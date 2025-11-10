import React, { useState, useEffect, useCallback } from "react";
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
import { Link } from "react-router-dom";
import { FaTrash, FaEdit } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  ImageIcon,
  Link as LinkIcon,
  Link2Off,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Underline as UnderlineIcon,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  Highlighter,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  Minus,
  Undo,
  Redo,
} from "lucide-react";
import { FiUpload, FiX } from "react-icons/fi";
import useAdminAuth from "./AdminAuth";

// Custom Menu Bar Component
const CustomMenuBar = ({ editor }) => {
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");

  if (!editor) {
    return null;
  }

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageInsert = useCallback(() => {
    if (imagePreviewUrl) {
      editor.chain().focus().setImage({ src: imagePreviewUrl }).run();
      setImageUrl("");
      setImageFile(null);
      setImagePreviewUrl("");
      setShowImageDialog(false);
    } else if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
      setShowImageDialog(false);
    }
  }, [editor, imageUrl, imagePreviewUrl]);

  const handleLinkInsert = useCallback(() => {
    if (linkUrl) {
      if (linkText && editor.state.selection.empty) {
        editor
          .chain()
          .focus()
          .insertContent(`<a href="${linkUrl}">${linkText}</a>`)
          .run();
      } else {
        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: linkUrl })
          .run();
      }
      setLinkUrl("");
      setLinkText("");
      setShowLinkDialog(false);
    }
  }, [editor, linkUrl, linkText]);

  const handleUnlink = useCallback(() => {
    editor.chain().focus().unsetLink().run();
  }, [editor]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-1 bg-gray-50 border-b border-gray-300 p-2">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className={`p-2 rounded hover:bg-gray-200 transition ${
              !editor.can().undo()
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700"
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className={`p-2 rounded hover:bg-gray-200 transition ${
              !editor.can().redo()
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700"
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo className="h-4 w-4" />
          </button>
        </div>

        {/* Text Format */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`p-2 rounded transition ${
              editor.isActive("paragraph")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Normal Text"
          >
            <Pilcrow className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`p-2 rounded transition ${
              editor.isActive("heading", { level: 1 })
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`p-2 rounded transition ${
              editor.isActive("heading", { level: 2 })
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`p-2 rounded transition ${
              editor.isActive("heading", { level: 3 })
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </button>
        </div>

        {/* Text Styles */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded transition ${
              editor.isActive("bold")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded transition ${
              editor.isActive("italic")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded transition ${
              editor.isActive("underline")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded transition ${
              editor.isActive("strike")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`p-2 rounded transition ${
              editor.isActive("highlight")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Highlight"
          >
            <Highlighter className="h-4 w-4" />
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded transition ${
              editor.isActive("bulletList")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded transition ${
              editor.isActive("orderedList")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
        </div>

        {/* Code & Quote */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-2 rounded transition ${
              editor.isActive("code")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Inline Code"
          >
            <Code className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded transition ${
              editor.isActive("codeBlock")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Code Block"
          >
            <Code2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded transition ${
              editor.isActive("blockquote")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </button>
        </div>

        {/* Super/Subscript */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            className={`p-2 rounded transition ${
              editor.isActive("superscript")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Superscript"
          >
            <SuperscriptIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            className={`p-2 rounded transition ${
              editor.isActive("subscript")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Subscript"
          >
            <SubscriptIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`p-2 rounded transition ${
              editor.isActive({ textAlign: "left" })
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`p-2 rounded transition ${
              editor.isActive({ textAlign: "center" })
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`p-2 rounded transition ${
              editor.isActive({ textAlign: "right" })
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            className={`p-2 rounded transition ${
              editor.isActive({ textAlign: "justify" })
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Justify"
          >
            <AlignJustify className="h-4 w-4" />
          </button>
        </div>

        {/* Image, Link & HR */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowImageDialog(true)}
            className="p-2 rounded hover:bg-gray-200 text-gray-700 transition"
            title="Insert Image"
          >
            <ImageIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowLinkDialog(true)}
            className={`p-2 rounded transition ${
              editor.isActive("link")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Insert Link"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
          {editor.isActive("link") && (
            <button
              type="button"
              onClick={handleUnlink}
              className="p-2 rounded hover:bg-gray-200 text-gray-700 transition"
              title="Remove Link"
            >
              <Link2Off className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-2 rounded hover:bg-gray-200 text-gray-700 transition"
            title="Horizontal Line"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Image Dialog */}
      {showImageDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg p-6 w-[500px] shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Insert Image</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload from Computer
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {imagePreviewUrl && (
                <div className="mt-3">
                  <img
                    src={imagePreviewUrl}
                    alt="Preview"
                    className="w-full h-40 object-contain rounded-md border-2 border-gray-200 bg-gray-50"
                  />
                </div>
              )}
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Insert from URL
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleImageInsert();
                  if (e.key === "Escape") {
                    setShowImageDialog(false);
                    setImageUrl("");
                    setImageFile(null);
                    setImagePreviewUrl("");
                  }
                }}
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowImageDialog(false);
                  setImageUrl("");
                  setImageFile(null);
                  setImagePreviewUrl("");
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImageInsert}
                disabled={!imagePreviewUrl && !imageUrl}
                className={`px-4 py-2 text-white rounded-md ${
                  imagePreviewUrl || imageUrl
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Insert Link</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Link text (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLinkInsert();
                  if (e.key === "Escape") setShowLinkDialog(false);
                }}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowLinkDialog(false);
                  setLinkUrl("");
                  setLinkText("");
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLinkInsert}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Main Blog Modal Page Component
const BlogModalPage = () => {
  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: getTodayDate(),
    author: "",
    tags: "",
    content: "",
   
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allComments, setAllComments] = useState([]);

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
      Placeholder.configure({ placeholder: "Start writing your blog post..." }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, content: editor.getHTML() }));
    },
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
    const fileInput = document.getElementById("fileUpload");
    if (fileInput) fileInput.value = "";
  };

  const resetForm = () => {
    setFormData({
      title: "",
      date: getTodayDate(),
      author: profile.firstName,
      tags: "",
      content: "",
      
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
        toast.success("Blog updated successfully!");
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/blogs`, data);
        toast.success("Blog published successfully!");
      }
      setShowModal(false);
      resetForm();
      fetchBlogs();
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Failed to save blog.");
    }
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/blogs`
      );
      setBlogs(res.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
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
      tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags,
      content: blog.content,
     
    });

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

    setTimeout(() => {
      if (editor) {
        editor.commands.setContent(blog.content || "");
        editor.commands.focus();
      }
    }, 100);
  };

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
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;
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

  const { profile, fetchProfile } = useAdminAuth();
  
    

  useEffect(() => {
    fetchProfile();
    fetchBlogs();
    fetchAllComments();
  }, []);   

  useEffect(() => {
  if (profile && profile.firstName) {
    setFormData((prev) => ({
      ...prev,
      author: `${profile.firstName} ${profile.lastName || ""}`.trim(),
    }));
  }
}, [profile]);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <style>{`
        .ProseMirror {
          min-height: 350px;
          padding: 1rem;
          outline: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror h1 {
          font-size: 2.25em;
          font-weight: 700;
          line-height: 1.2;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          color: #111827;
        }
        .ProseMirror h2 {
          font-size: 1.875em;
          font-weight: 700;
          line-height: 1.3;
          margin-top: 1.25rem;
          margin-bottom: 0.875rem;
          color: #111827;
        }
        .ProseMirror h3 {
          font-size: 1.5em;
          font-weight: 600;
          line-height: 1.4;
          margin-top: 1rem;
          margin-bottom: 0.75rem;
          color: #111827;
        }
        .ProseMirror p {
          margin-top: 0.75rem;
          margin-bottom: 0.75rem;
          line-height: 1.75;
          color: #374151;
        }
        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 2rem;
          margin-top: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .ProseMirror ul {
          list-style-type: disc;
        }
        .ProseMirror ol {
          list-style-type: decimal;
        }
        .ProseMirror li {
          margin-top: 0.375rem;
          margin-bottom: 0.375rem;
          line-height: 1.75;
          color: #374151;
        }
        .ProseMirror li p {
          margin: 0;
        }
        .ProseMirror ul ul,
        .ProseMirror ol ul {
          list-style-type: circle;
        }
        .ProseMirror ol ol,
        .ProseMirror ul ol {
          list-style-type: lower-alpha;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #6b7280;
        }
        .ProseMirror code {
          background-color: #f3f4f6;
          color: #ef4444;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-family: 'Courier New', monospace;
          font-size: 0.875em;
        }
        .ProseMirror pre {
          background-color: #1f2937;
          color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
          font-family: 'Courier New', monospace;
        }
        .ProseMirror pre code {
          background: none;
          color: inherit;
          padding: 0;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
        }
        .ProseMirror a {
          color: #3b82f6;
          text-decoration: underline;
          cursor: pointer;
        }
        .ProseMirror a:hover {
          color: #2563eb;
        }
        .ProseMirror mark {
          background-color: #fef08a;
          padding: 0.125rem 0.25rem;
          border-radius: 0.125rem;
        }
        .ProseMirror hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 2rem 0;
        }
        .ProseMirror sup {
          vertical-align: super;
          font-size: 0.75em;
        }
        .ProseMirror sub {
          vertical-align: sub;
          font-size: 0.75em;
        }
        .ProseMirror strong {
          font-weight: 700;
        }
        .ProseMirror em {
          font-style: italic;
        }
        .ProseMirror s {
          text-decoration: line-through;
        }
        .ProseMirror u {
          text-decoration: underline;
        }
      `}</style>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/20 p-4 overflow-y-auto ">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[calc(100%-32px)] sm:max-w-3xl md:max-w-4xl lg:max-w-5xl my-6 mx-2  h-screen">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b  bg-white z-10 rounded-t-xl gap-3">
              <h2 className="text-2xl font-bold text-gray-900">
                {isEditing ? " Edit Blog" : " Create New Blog"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-red-500 text-3xl leading-none transition cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 bg-white">
              <div className="space-y-5">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Blog Title *"
                  className="w-full p-3 text-lg font-medium border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Author Name *"
                    className="p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>

                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Category (e.g., Tech)"
                    className="p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    placeholder="Language"
                    className="p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <input
                    type="number"
                    name="review"
                    value={formData.review}
                    onChange={handleChange}
                    placeholder="Rating (0-5)"
                    min="0"
                    max="5"
                    step="0.1"
                    className="p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div> */}

                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  required
                  placeholder="Tags (comma-separated: tech, web, design)"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                />

                <div className="w-full">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Featured Image
                  </label>

                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="fileUpload"
                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-blue-50 transition duration-300 ease-in-out"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FiUpload className="text-blue-600 text-3xl mb-2" />
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold text-blue-700">
                            Click to upload
                          </span>{" "}
                          or drag & drop
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          PNG, JPG, or JPEG (max 5MB)
                        </p>
                      </div>
                      <input
                        id="fileUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        
                      />
                    </label>
                  </div>

                  {imagePreview && (
                    <div className="relative mt-5 group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-56 object-cover rounded-xl border-2 border-gray-200 shadow-md"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition duration-300"
                        title="Remove Image"
                      >
                        <FiX className="text-lg" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Content *
                  </label>
                  <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                    <CustomMenuBar editor={editor} />
                    <EditorContent editor={editor} />
                  </div>
                </div>

                {/* <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Social Links
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="LinkedIn URL"
                      className="p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <input
                      type="url"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      placeholder="Twitter URL"
                      className="p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <input
                      type="url"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                      placeholder="Facebook URL"
                      className="p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <input
                      type="url"
                      name="dribbble"
                      value={formData.dribbble}
                      onChange={handleChange}
                      placeholder="Dribbble URL"
                      className="p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div> */}

              </div>

              <div className="mt-6 pt-6 border-t flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium shadow-md transition"
                >
                  {isEditing ? " Update Blog" : " Publish Blog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blog Posts Section */}
      <div className="mb-10">
        <div className="flex justify-between flex-col md:flex-row md:items-center mb-6">
          <h1 className="md:text-4xl text-2xl font-bold text-gray-900">
            Blog Management
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white md:px-6 md:py-3 py-1.5 rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium shadow-md transition transform hover:scale-105 cursor-pointer mt-2"
          >
            + Create New Blog
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-md">
            <p className="text-gray-500 text-xl">
              📝 No blogs yet. Create your first blog post!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative"
              >
                <Link
                  to={`/admin/blogdetail/${blog._id}`}
                  state={blog}
                  className="block"
                >
                  <div className="relative overflow-hidden h-52">
                    {blog.image ? (
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/${
                          blog.image
                        }`}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <span className="text-white text-6xl">📄</span>
                      </div>
                    )}
                    {blog.tags?.length > 0 && (
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white shadow-md">
                        {blog.tags[0] || "Blog"}
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {blog.content
                        ? `${blog.content.replace(/<[^>]+>/g, "")}...`
                        : "No preview available"}
                    </p>
                    {/* <div
                      className="text-gray-600 text-sm max-w-none line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: blog.content }}
                    /> */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <time className="font-medium">
                        {new Date(blog.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                      <span className="text-blue-600 font-semibold">
                        Read More →
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="absolute top-3 right-3 flex  bg-white/95 backdrop-blur-sm rounded-full p-1.5 shadow-lg">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition cursor-pointer"
                    title="Edit"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-full transition cursor-pointer"
                    title="Delete"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
           Blog Comments
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Blog
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Comment
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Date
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allComments.length > 0 ? (
                allComments.map((c) => (
                  <tr key={c._id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {c.blogId?.title || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {c.firstName} {c.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {c.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {c.comment}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => deleteComment(c._id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    💭 No comments yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default BlogModalPage;
