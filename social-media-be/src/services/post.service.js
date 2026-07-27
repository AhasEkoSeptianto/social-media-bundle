const Post = require("../models/post.model");
const Like = require("../models/like.model");
const commentModel = require("../models/comment.model");
const userModel = require("../models/user.model");
const {
  notifyService,
  deleteNotificationByPostIds,
} = require("./notification.service");
const { UploadImage } = require("./cloudinary.service");
const { default: mongoose } = require("mongoose");

async function createPostServices({ user_id, content, temp_img_path }) {
  // uploadedImages = hasil dari proses upload ke Cloudinary/S3,
  // formatnya array of { url, publicId }
  let options = {
    author: user_id,
    postContext: content,
  };
  if (temp_img_path) {
    let saveImg = await UploadImage(temp_img_path);
    options.images = saveImg;
  }

  const post = await Post.create(options);

  await userModel.findByIdAndUpdate(user_id, {
    $inc: {
      postCount: +1,
    },
  });

  return post;
}

async function deletePostServices({ user_id, post_id }) {
  const session = await mongoose.startSession();
  let post = {};
  try {
    session.startTransaction();

    // delete comment
    await commentModel.deleteMany({ post: post_id });

    // delete like
    await Like.deleteMany({ post: post_id });

    // delete notification
    await deleteNotificationByPostIds({ post_id: post_id });

    // delete post
    post = await Post.deleteOne({
      _id: post_id,
      author: user_id,
    });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
  } finally {
    await session.endSession();
  }

  return post;
}

async function getPostServices({ page, limit, user_id, isMyPost, images }) {
  const skip = (page - 1) * limit;
  const filter = {};

  if (isMyPost) {
    filter.author = user_id;
  }
  if (images) {
    filter.images = {
      $exists: true,
      $ne: "",
    };
  }

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .populate("author")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Post.countDocuments(),
  ]);

  const likes = await Like.find({
    user: user_id,
    post: {
      $in: posts.map((post) => post._id),
    },
  });
  const likedPostIds = new Set(likes.map((like) => like.post.toString()));
  const result = posts.map((post) => ({
    ...post,
    isLiked: likedPostIds.has(post._id.toString()),
  }));

  return {
    posts: result,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function likePostService(userId, postId) {
  const alreadyLiked = await Like.findOne({
    user: userId,
    post: postId,
  });

  if (alreadyLiked) {
    const deleted = await Like.findOneAndDelete({
      user: userId,
      post: postId,
    });

    if (deleted) {
      await Post.findByIdAndUpdate(postId, {
        $inc: {
          likesCount: -1,
        },
      });
    }
  } else {
    await Like.create({
      user: userId,
      post: postId,
    });

    const post = await Post.findByIdAndUpdate(postId, {
      $inc: {
        likesCount: 1,
      },
    });

    console.log(post);

    // set activity
    if (userId !== post._id) {
      await notifyService(userId, post.author, "like", post.id);
    }
  }
}

// comment
async function createCommentServices(user_id, post_id, content) {
  const commentPost = await commentModel.create({
    author: user_id,
    post: post_id,
    content: content,
  });

  const post = await Post.findByIdAndUpdate(post_id, {
    $inc: {
      commentsCount: 1,
    },
  });

  await notifyService(
    user_id,
    post.author._id,
    "comment",
    post._id,
    commentPost._id,
  );
  return commentPost;
}

async function getCommentServices(post_id, page, limit) {
  const skip = (page - 1) * limit;
  const commentPost = await commentModel
    .find({
      post: post_id,
    })
    .populate("author")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return commentPost;
}

module.exports = {
  createPostServices,
  getPostServices,
  deletePostServices,
  likePostService,
  createCommentServices,
  getCommentServices,
};
