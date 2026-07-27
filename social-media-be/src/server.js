const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const connectDB = require("./config/database");
const { port, env } = require("./config/env");
const logger = require("./utils/logger");
const corsOptions = require("./config/cors");

const server = http.createServer(app);

const io = new Server(server, {
  cors: corsOptions,
});

// register socket
require("./socket")(io);

async function startServer() {
  // WAJIB tunggu koneksi DB selesai SEBELUM mulai terima request/koneksi socket.
  // Server ini deploy di Render (server tradisional, selalu nyala) -- BUKAN
  // serverless -- jadi aman connect sekali di sini saja saat startup.
  try {
    await connectDB();
  } catch (err) {
    logger.error("Gagal konek ke database saat startup:", err.message);
    if (env === "production") {
      process.exit(1); // di server tradisional, memang harus stop kalau DB gagal total
    }
    logger.warn("Server tetap jalan tanpa DB (mode development).");
  }

  server.listen(port, () => {
    logger.info(`Server running on http://localhost:${port}`);
  });
}

startServer();
