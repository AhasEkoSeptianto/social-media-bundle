exports.fileUploads = async (req, res) => {
  const post = await createPostService(req);

  res.json(post);
};
