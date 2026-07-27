const { default: mongoose } = require("mongoose");
const followModel = require("../models/follow.model");
const UserModel = require("../models/user.model");
const { notifyService } = require("./notification.service");

async function followUserService(user_id, following_id) {
  const session = await mongoose.startSession();
  var result = null;
  if (user_id === following_id) {
    throw new Error("Tidak bisa follow diri sendiri");
  }

  const exists = await followModel.exists({
    follower: user_id,
    following: following_id,
  });

  try {
    session.startTransaction();

    if (exists) {
      await followModel.findOneAndDelete(
        { follower: user_id, following: following_id },
        { session },
      );
    } else {
      await followModel.create(
        [
          {
            follower: user_id,
            following: following_id,
          },
        ],
        { session },
      );

      // notify
      await notifyService(user_id, following_id, "follow");
    }

    await UserModel.findByIdAndUpdate(
      user_id,
      {
        $inc: { followingCount: exists ? -1 : +1 },
      },
      { session },
    );

    await UserModel.findByIdAndUpdate(
      following_id,
      {
        $inc: { followerCount: exists ? -1 : +1 },
      },
      { session },
    );

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }

  return result;
}

module.exports = { followUserService };
