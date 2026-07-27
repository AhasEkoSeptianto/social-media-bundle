const {
  createPostServices,
  getPostServices,
  deletePostServices,
  likePostService,
  createCommentServices,
  getCommentServices,
} = require("../services/post.service");

async function createPost(req, res, next) {
  try {
    const { content } = req.body;

    const fileImage = req.files?.image;
    const temp_img_path = fileImage?.tempFilePath;
    const user_id = req.user.id;
    if (!content) {
      return res.status(400).json({
        success: false,
        message: "content wajib diisi",
      });
    }
    const post = await createPostServices({ user_id, content, temp_img_path });
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
}

async function getPost(req, res, next) {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const isMyPost = req.query.myPost;
    const images = req.query.images;
    const user_id = req.user.id;

    const posts = await getPostServices({
      page,
      limit,
      user_id,
      isMyPost,
      images,
    });

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
}
async function deletePost(req, res, next) {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const posts = await deletePostServices({ user_id, post_id: id });

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function likePost(req, res, next) {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const posts = await likePostService(user_id, id);

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

// comment

async function createComment(req, res, next) {
  try {
    const { post_id } = req.params;
    const user_id = req.user.id;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "content wajib diisi",
      });
    }

    const comment = await createCommentServices(user_id, post_id, content);
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
}

async function getCommentPost(req, res, next) {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const { post_id } = req.params;
    const comment = await getCommentServices(post_id, page, limit);

    res.status(200).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createPost,
  getPost,
  deletePost,
  likePost,
  createComment,
  getCommentPost,
};
