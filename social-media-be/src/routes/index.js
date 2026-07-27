const express = require("express");
const authRoutes = require("./auth.routes");
const postRoutes = require("./post.route");
const profileRoutes = require("./profile.route");
const userRoute = require("./users.route");
const followRoute = require("./follow.route");
const notificationRoute = require("./notification.route");
const chatRoute = require("./chat.route");
const conversationRoute = require("./conversation.route");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/profile", profileRoutes);
router.use("/users", userRoute);
router.use("/follow", followRoute);
router.use("/notification", notificationRoute);
router.use("/chat", chatRoute);
router.use("/chat", conversationRoute);

module.exports = router;
