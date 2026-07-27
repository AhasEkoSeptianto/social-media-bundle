const followModel = require("../models/follow.model");

async function getFriendOnlineListService(user_id) {
  const followerIds = await new Set(
    (
      await followModel
        .find({ following: user_id })
        .select("follower -_id")
        .lean()
    ).map(({ follower }) => follower.toString()),
  );

  return followerIds;
}

module.exports = { getFriendOnlineListService };
