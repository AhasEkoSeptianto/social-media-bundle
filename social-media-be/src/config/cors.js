// src/config/cors.js
const { clientUrl } = require("./env");

// CLIENT_URL bisa berisi lebih dari satu domain, dipisah koma, misal:
// CLIENT_URL=https://your-app.netlify.app,http://localhost:3000
const allowedOrigins = clientUrl.split(",").map((url) => url.trim());

function isOriginAllowed(origin) {
  if (allowedOrigins.includes(origin)) return true;

  // Izinkan semua preview/branch deployment Netlify untuk site ini.
  // Contoh domain preview Netlify: https://deploy-preview-3--sosial-mediaa.netlify.app
  //                                 https://branch-name--sosial-mediaa.netlify.app
  if (/^https:\/\/([a-z0-9-]+--)?sosial-mediaa\.netlify\.app$/.test(origin))
    return true;

  return false;
}

const corsOptions = {
  origin: (origin, callback) => {
    // origin undefined = request tanpa origin header (curl, server-to-server, dsb) -> izinkan
    if (!origin || isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} tidak diizinkan oleh CORS`));
    }
  },
  credentials: true,
};

module.exports = corsOptions;
