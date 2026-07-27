const {
  getProfileService,
  updateProfileService,
} = require("../services/profile.service");

async function getProfile(req, res, next) {
  try {
    const user_id = req.user.id;

    const profile = await getProfileService(user_id);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const user_id = req.user.id;
    const { username, bio, tag } = req.body;

    const fileImage = req.files?.image;
    const temp_img_path = fileImage?.tempFilePath || "";

    const profile = await updateProfileService(
      user_id,
      username,
      temp_img_path,
      bio,
      tag,
    );

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getProfile, updateProfile };
