const { getUserNotifyService } = require("../services/notification.service");
const { getUsersList } = require("../services/user.service");

async function getNotifyUser(req, res, next) {
  try {
    const user_id = req.user.id;
    const notify = await getUserNotifyService(user_id);

    res.status(200).json({
      success: true,
      data: notify,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getNotifyUser };
