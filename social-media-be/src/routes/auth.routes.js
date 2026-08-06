const express = require("express");
const {
  loginWithGoogle,
  register,
  loginWithEmail,
  getCurrentUser,
  logout,
} = require("../controllers/auth.controller");
const requireAuth = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/google", loginWithGoogle);
router.post("/register", register);

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: Success
 */
router.post("/login", loginWithEmail);
router.get("/me", requireAuth, getCurrentUser);
router.post("/logout", logout);

module.exports = router;
