const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    postContext: {
      type: String,
      trim: true,
    },
    images: {
      type: String,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },

    sharesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

postSchema.index({ createdAt: -1 }); // buat sorting feed terbaru

// (opsional) Batasi maksimal jumlah gambar per post
// postSchema.pre("validate", function (next) {
//   if (this.images && this.images.length > 10) {
//     return next(new Error("Maksimal 10 gambar per post"));
//   }
//   next();
// });

module.exports = mongoose.model("Post", postSchema);
