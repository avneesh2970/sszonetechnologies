const express = require("express");
const { addComment, getCommentsByBlog, deleteComment, getAllComments } = require("../controllers/commentController");
const router = express.Router();


router.post('/:blogId/comments' , addComment );
router.get('/:blogId/comments' , getCommentsByBlog)
router.delete('/delete/:commentId' , deleteComment)
router.get("/all", getAllComments);
// router.delete('/dltComment/:id', commentController.dltComment)

module.exports = router 