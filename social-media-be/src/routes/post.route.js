const express = require("express");

const requireAuth = require("../middleware/auth.middleware");
const {
  createPost,
  getPost,
  deletePost,
  likePost,
  createComment,
  getCommentPost,
} = require("../controllers/post.controller");

const router = express.Router();

router.get("/comment/:post_id", requireAuth, getCommentPost);
router.post("/comment/:post_id", requireAuth, createComment);
router.delete("/delete/:id", requireAuth, deletePost);
router.post("/create", requireAuth, createPost);

router.put("/like/:id", requireAuth, likePost);

router.get("/", requireAuth, getPost);

module.exports = router;
