const followModel = require("../models/follow.model");
const notificationModel = require("../models/notification.model");

async function notifyService(
  user_id,
  recipient_id,
  type = "follow" | "like" | "comment" | "reply" | "mention",
  post_id,
  comment_id,
) {
  const result = await notificationModel.create({
    actor: user_id,
    type: type,
    recipient: recipient_id,
    post: post_id,
    comment: comment_id,
  });

  return result;
}

async function getUserNotifyService(user_id) {
  const notification = await notificationModel
    .find({ recipient: user_id })
    .populate(["actor", "post", "comment"])
    .sort({ createdAt: -1 })
    .lean();

  // get staus isFollowBack
  const follower = await followModel.find({
    follower: user_id,
  });

  const followingIds = new Set(
    follower.map((follow) => follow.following.toString()),
  );

  const result = notification.map((notif) => ({
    ...notif,
    isFollowBack: followingIds.has(notif?.actor?._id?.toString()),
  }));

  return result;
}

async function deleteNotificationByPostIds({ post_id }) {
  let res = await notificationModel.deleteMany({ post: post_id });
  return res;
}

module.exports = {
  notifyService,
  deleteNotificationByPostIds,
  getUserNotifyService,
};
