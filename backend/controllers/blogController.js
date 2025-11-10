const Blog = require('../models/blogModel');

// Create Blog
exports.createBlog = async (req, res) => {
  try {
    const { title, date, author, tags, content,  } = req.body;
    const blog = new Blog({
      title,
      date,
      author,
      tags: tags.split(',').map(tag => tag.trim()),
      content,
      image: req.file ? req.file.path : null,
      
    });
    await blog.save();
    res.status(201).json({ message: 'Blog uploaded successfully', blog });
  } catch (error) {
    console.error('Error saving blog:', error);
    res.status(500).json({ message: 'Failed to upload blog', error: error.message });
  }
};

// Get All Blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Failed to fetch blogs', error: error.message });
  }
};

// Update Blog
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, author, tags, content  } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        date,
        author,
        tags: tags?.split(',').map(tag => tag.trim()),
        content,
        ...(req.file && { image: req.file.path }),
        
      },
      { new: true } // Return updated document
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json({ message: 'Blog updated successfully', blog: updatedBlog });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ message: 'Failed to update blog', error: error.message });
  }
};

// Delete Blog
// exports.deleteBlog = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deletedBlog = await Blog.findByIdAndDelete(id);

//     if (!deletedBlog) {
//       return res.status(404).json({ message: 'Blog not found' });
//     }

//     res.status(200).json({ message: 'Blog deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting blog:', error);
//     res.status(500).json({ message: 'Failed to delete blog', error: error.message });
//   }
// };
exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findOneAndDelete({ _id: req.params.id });
    res.status(200).json({ message: "Blog and image deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ message: "Failed to delete blog", error: error.message });
  }
};


