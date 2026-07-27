const { getListChatFrinedService } = require("../services/chat.service");
const {
  getProfileService,
  updateProfileService,
} = require("../services/profile.service");

async function getListChat(req, res, next) {
  try {
    const user_id = req.user.id;

    const profile = await getListChatFrinedService(user_id);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getListChat };
