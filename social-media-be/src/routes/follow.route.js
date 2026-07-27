const express = require("express");

const requireAuth = require("../middleware/auth.middleware");
const { followUser } = require("../controllers/follow.controller");

const router = express.Router();

router.post("/:following_id", requireAuth, followUser);

module.exports = router;
