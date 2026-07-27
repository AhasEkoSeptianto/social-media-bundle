const cloudinary = require("cloudinary");
const {
  cloudinary_name,
  cloudinary_api_key,
  cloudinary_secret_key,
} = require("./env");

cloudinary.config({
  cloud_name: cloudinary_name,
  api_key: cloudinary_api_key,
  api_secret: cloudinary_secret_key,
});

module.exports = cloudinary;
