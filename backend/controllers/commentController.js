const Comment = require("../models/commentModel");
const Blog = require("../models/blogModel");

exports.addComment = async (req, res) => {
  const { blogId } = req.params;
  const { firstName,  email, comment } = req.body;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });

    const newComment = new Comment({
      blogId,
      firstName,
      email,
      comment,
    });

    await newComment.save();
    res.status(201).json({ success: true, comment: newComment });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error adding comment",
        error: err.message,
      });
  }
};

// GET /api/blogs/:blogId/comments
exports.getCommentsByBlog = async (req, res) => {
  const { blogId } = req.params;

  try {
    const comments = await Comment.find({ blogId }).sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching comments",
        error: err.message,
      });
  }
};
//Get all Commments for admin
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("blogId", "title") // <-- get blog title only
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error("Get All Comments Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const deleted = await Comment.findByIdAndDelete(commentId);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }
    res.status(200).json({ success: true, message: "Comment deleted" });
  } catch (error) {
    console.error("Delete Comment Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
