// src/socket/index.js
const logger = require("../utils/logger");

// Satu Map dishare ke semua handler socket, supaya chat.socket.js dan
// notification.socket.js bisa tahu siapa saja yang online (untuk targeted emit),
// bukan cuma online.socket.js.
//
// CATATAN PENTING: Map ini disimpan di memory 1 instance server saja.
// Kalau backend di-deploy sebagai SERVERLESS (Vercel Functions), setiap
// invocation bisa jalan di instance berbeda -- data ini TIDAK akan konsisten
// antar instance. WebSocket + in-memory state seperti ini butuh server
// tradisional yang selalu nyala (Railway/Render/VPS), bukan serverless.
const onlineUsers = new Map();

module.exports = (io) => {
  io.on("connection", (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    require("./chat.socket")(io, socket, onlineUsers);
    require("./notification.socket")(io, socket, onlineUsers);
    require("./online.socket")(io, socket, onlineUsers);
  });
};
