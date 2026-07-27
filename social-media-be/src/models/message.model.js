const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    // Untuk kirim gambar di chat (opsional, sesuai pola images di Post)
    image: {
      url: { type: String },
      publicId: { type: String },
    },
    // Siapa saja yang sudah baca pesan ini -- berguna untuk centang biru/read receipt
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

// Query paling umum: ambil pesan dalam 1 percakapan, urut dari yang terbaru/terlama
messageSchema.index({ conversation: 1, createdAt: 1 });

// Wajib ada text ATAU gambar, tidak boleh kosong dua-duanya
messageSchema.pre("validate", function (next) {
  if (!this.text && !this.image?.url) {
    return next(new Error("Pesan harus punya teks atau gambar"));
  }
  next();
});

module.exports = mongoose.model("Message", messageSchema);
