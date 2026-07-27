require("dotenv").config();

function required(key) {
  const value = process.env[key];
  if (!value && process.env.NODE_ENV !== "test") {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
}

module.exports = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 4000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",

  mongodbUri:
    process.env.MONGODB_URI || "mongodb://localhost:27017/express_google_auth",

  google: {
    clientId: required("GOOGLE_CLIENT_ID"),
  },

  jwt: {
    secret: required("JWT_SECRET"),
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },

  cookieName: process.env.COOKIE_NAME || "session_token",

  cloudinary_name: required("CLOUDINARY_NAME"),
  cloudinary_api_key: required("CLOUDINARY_API_KEY"),
  cloudinary_secret_key: required("CLOUDINARY_SECRET_KEY"),
};
