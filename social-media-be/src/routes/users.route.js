const express = require("express");

const requireAuth = require("../middleware/auth.middleware");
const { getUsers, getUsersById } = require("../controllers/search.controller");

const router = express.Router();

router.get("/", requireAuth, getUsers);
router.get("/user-id/:id", requireAuth, getUsersById);

module.exports = router;
