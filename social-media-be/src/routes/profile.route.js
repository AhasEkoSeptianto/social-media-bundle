const express = require("express");

const requireAuth = require("../middleware/auth.middleware");
const {
  getProfile,
  updateProfile,
} = require("../controllers/profile.controller");

const router = express.Router();

router.put("/update", requireAuth, updateProfile);
router.get("/", requireAuth, getProfile);

module.exports = router;
