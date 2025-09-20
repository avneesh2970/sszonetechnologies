

const express = require('express');
const router = express.Router();
const upload = require("../multer")
const path = require('path');
const blogController = require('../controllers/blogController');


// Routes
router.post('/', upload.single('image'), blogController.createBlog);
router.get('/', blogController.getAllBlogs);
router.put('/blogs/:id', upload.single('image'), blogController.updateBlog);
router.delete('/blogs/:id', blogController.deleteBlog);
// router.get('/:id', blogController.getBlogById);

module.exports = router;
