const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const { jwt: jwtConfig } = require("../config/env");
const AppError = require("../utils/AppError");

const SALT_ROUNDS = 10;

/**
 * Cari user berdasarkan googleId. Kalau belum ada, buat baru.
 */
async function findOrCreateUser({ googleId, email, name, avatarUrl }) {
  let user = await User.findOne({ googleId });

  if (!user) {
    user = await User.create({ googleId, email, name, avatarUrl });
  }

  return user;
}

/**
 * Registrasi user baru dengan email & password.
 */
async function registerWithEmail({ email, password, name }) {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError("Email sudah terdaftar", 409);
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    email,
    password: hashedPassword,
    name,
  });

  return user;
}

/**
 * Login dengan email & password. Melempar AppError kalau tidak cocok.
 */
async function loginWithEmailPassword({ email, password }) {
  // password di-exclude default di schema, jadi harus select eksplisit
  const user = await User.findOne({ email }).select("+password");

  if (!user || !user.password) {
    // pesan generik supaya tidak bocorkan apakah email terdaftar atau tidak
    throw new AppError("Email atau password salah", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Email atau password salah", 401);
  }

  return user;
}

function generateSessionToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn },
  );
}

function verifySessionToken(token) {
  return jwt.verify(token, jwtConfig.secret);
}

module.exports = {
  findOrCreateUser,
  registerWithEmail,
  loginWithEmailPassword,
  generateSessionToken,
  verifySessionToken,
};
