const connectDB = require("./src/config/database");
const postModel = require("./src/models/post.model");

async function testCron() {
  await connectDB();
  const post = await postModel.findOneAndUpdate(
    { _id: "6a5c1f023d5d6bf75e83853b" },
    { $inc: { sharesCount: 1 } },
    { new: true },
  );
}

testCron();
