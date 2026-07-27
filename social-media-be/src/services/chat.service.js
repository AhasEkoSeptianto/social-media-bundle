const User = require("../models/user.model");
const followModel = require("../models/follow.model");

async function getListChatFrinedService(user_id) {
  const result = "";
  const follower = await followModel
    .find({ following: user_id })
    .populate(["follower", "following"]);

  const followingIds = await new Set(
    (await followModel.find({ follower: user_id })).map(({ following }) =>
      following._id?.toString(),
    ),
  );

  const friends = follower
    .filter(({ follower }) => followingIds.has(follower._id.toString()))
    .map(({ follower }) => follower);

  return friends;
}

module.exports = { getListChatFrinedService };
