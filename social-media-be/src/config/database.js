const mongoose = require("mongoose");
const { mongodbUri, env } = require("./env");
const logger = require("../utils/logger");

// Matikan command buffering: kalau belum konek, query langsung error
// (bukan nunggu 10 detik default) -- lebih mudah didebug di serverless.
mongoose.set("bufferCommands", false);

// Cache koneksi supaya tidak connect ulang tiap invocation (penting untuk serverless)
let isConnected = false;

async function connectDB() {
  if (env === "test") return; // skip koneksi saat testing

  if (isConnected && mongoose.connection.readyState === 1) {
    return; // sudah konek (warm start di serverless), tidak perlu connect ulang
  }

  try {
    await mongoose.connect(mongodbUri, {
      serverSelectionTimeoutMS: 8000, // gagal cepat kalau tidak bisa reach cluster, jangan nunggu default 30s
    });
    isConnected = true;
    logger.info("MongoDB connected");
  } catch (err) {
    logger.error("MongoDB connection failed:", err.message);
    // Lempar error, biarkan pemanggil (server.js atau netlify function) yang putuskan
    // apa yang harus dilakukan. JANGAN process.exit() di sini -- berbahaya di serverless.
    throw err;
  }
}

module.exports = connectDB;
