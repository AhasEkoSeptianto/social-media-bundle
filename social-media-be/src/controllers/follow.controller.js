const { followUserService } = require("../services/follow.service");

async function followUser(req, res, next) {
  try {
    const user_id = req.user.id;
    const { following_id } = req.params;
    const users = await followUserService(user_id, following_id);

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { followUser };
