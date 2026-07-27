const express = require("express");

const requireAuth = require("../middleware/auth.middleware");
const { getNotifyUser } = require("../controllers/notification.controller");

const router = express.Router();

router.get("/get", requireAuth, getNotifyUser);

module.exports = router;
