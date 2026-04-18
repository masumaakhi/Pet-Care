// backend/routes/communityRoutes.js
const express = require("express");
const {
  getPosts,
  createPost,
  toggleLike,
  getComments,
  addComment,
  deletePost
} = require("../controllers/communityController");
const { protect, optionalProtect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// GET all posts 
router.get("/", optionalProtect, getPosts);

// POST a new post
router.post("/", protect, upload.single("image"), createPost);

// POST toggle like on a post
router.post("/:id/like", protect, toggleLike);

// GET comments for a post
router.get("/:id/comments", optionalProtect, getComments);

// POST a new comment
router.post("/:id/comments", protect, addComment);

// DELETE a post
router.delete("/:id", protect, deletePost);

module.exports = router;
