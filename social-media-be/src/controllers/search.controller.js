const {
  getUsersList,
  getUserByIdService,
} = require("../services/user.service");

async function getUsers(req, res, next) {
  try {
    const keyword = req.query.search || "";
    const user_id = req.user.id;
    const users = await getUsersList(keyword, user_id);

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

async function getUsersById(req, res, next) {
  try {
    const { id } = req.params;

    const user_id = req.user.id;
    const users = await getUserByIdService(id);

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getUsers, getUsersById };
