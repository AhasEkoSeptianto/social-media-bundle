const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    // Array peserta percakapan. Untuk chat 1-on-1, isinya selalu 2 user.
    // Didesain array (bukan 2 field terpisah "userA"/"userB") supaya
    // gampang dikembangkan ke chat grup nanti tanpa ubah struktur.
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    // Cache pesan terakhir -- supaya list percakapan (inbox) bisa
    // ditampilkan cepat tanpa query ke koleksi Message tiap kali.
    lastMessage: {
      text: { type: String },
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      sentAt: { type: Date },
    },
  },
  { timestamps: true },
);

// Query cepat: "cari percakapan yang melibatkan user ini"
conversationSchema.index({ participants: 1 });

// Cegah percakapan duplikat antara 2 user yang sama (untuk chat 1-on-1).
// Kombinasi participants diurutkan dulu sebelum disimpan (lihat service),
// supaya [A,B] dan [B,A] dianggap sama.
conversationSchema.index({ participants: 1, updatedAt: -1 });

module.exports = mongoose.model("Conversation", conversationSchema);
