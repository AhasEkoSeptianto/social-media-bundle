const userModel = require("../models/user.model");
const { UploadImage } = require("./cloudinary.service");

async function getProfileService(user_id) {
  const User = await userModel
    .find({
      _id: user_id,
    })
    .lean();

  return User;
}

async function updateProfileService(user_id, username, image_path, bio, tag) {
  const objectData = {
    username: username,
    bio: bio,
    tag: tag,
  };

  if (image_path) {
    let uploadImage = await UploadImage(image_path);
    objectData.avatarUrl = uploadImage?.url;
  }

  if (typeof tag === "string") objectData.tag = tag.split(",");

  const User = await userModel.findOneAndUpdate({ _id: user_id }, objectData, {
    new: true,
  });

  return User;
}

module.exports = { getProfileService, updateProfileService };
