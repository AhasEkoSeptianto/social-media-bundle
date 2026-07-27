const { default: mongoose } = require("mongoose");
const connectDB = require("./src/config/database");
const postModel = require("./src/models/post.model");

async function testCron() {
  try {
    await connectDB();

    const post = await postModel.findOneAndUpdate(
      { _id: "6a5c1f023d5d6bf75e83853b" },
      { $inc: { sharesCount: 1 } },
      { new: true },
    );

    console.log(post);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB disconnected");
  }
}

testCron()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
