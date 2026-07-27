const { verifySessionToken } = require("../services/auth.service");
const User = require("../models/user.model");
const AppError = require("../utils/AppError");
const { cookieName } = require("../config/env");

/**
 * Middleware untuk melindungi route yang butuh login.
 * Membaca session token dari cookie, verifikasi, lalu attach req.user.
 */
async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[cookieName];

    if (!token) {
      throw new AppError("Belum login", 401);
    }

    const decoded = verifySessionToken(token);
    const user = await User.findById(decoded.sub).lean();

    if (!user) {
      throw new AppError("User tidak ditemukan", 401);
    }

    req.user = {
      id: user._id,
      ...user,
    };
    next();
  } catch (err) {
    next(new AppError("Sesi tidak valid atau kedaluwarsa", 401));
  }
}

module.exports = requireAuth;
