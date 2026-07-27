const express = require("express");

const requireAuth = require("../middleware/auth.middleware");
const {
  getConversations,
  startConversation,
  getConversationMessages,
  postMessage,
} = require("../controllers/conversation.controller");

const router = express.Router();

router.get("/conversations", requireAuth, getConversations);
router.post("/conversations", requireAuth, startConversation);
router.get(
  "/conversations/:conversationId/messages",
  requireAuth,
  getConversationMessages,
);
router.post(
  "/conversations/:conversationId/messages",
  requireAuth,
  postMessage,
);

module.exports = router;
