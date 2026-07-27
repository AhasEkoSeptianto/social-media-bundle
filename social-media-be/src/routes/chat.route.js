const express = require("express");

const requireAuth = require("../middleware/auth.middleware");
const { getListChat } = require("../controllers/chat.controller");

const router = express.Router();

router.get("/list-chat", requireAuth, getListChat);

module.exports = router;
