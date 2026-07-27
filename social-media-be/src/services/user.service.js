const User = require("../models/user.model");
const followModel = require("../models/follow.model");

async function getUsersList(keyword, user_id) {
  const users = await User.find({
    $or: [
      {
        name: {
          $regex: keyword,
          $options: "i", // tidak case-sensitive
        },
      },
      {
        username: {
          $regex: keyword,
          $options: "i",
        },
      },
    ],
  })
    .select("-password")
    .limit(20)
    .lean();

  const following = await followModel.find({
    follower: user_id,
    following: {
      $in: users.map((user) => user._id),
    },
  });
  const followUserIds = new Set(
    following.map((follow) => follow.following.toString()),
  );
  const result = users.map((user) => ({
    ...user,
    isFollow: followUserIds.has(user?._id.toString()),
  }));

  return result;
}

async function getUserByIdService(id) {
  const user = await User.findOne({ _id: id });

  return user;
}

module.exports = { getUsersList, getUserByIdService };
