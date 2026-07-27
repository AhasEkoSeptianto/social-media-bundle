const { sendMessage } = require("../services/conversation.service");
const Conversation = require("../models/conversation.model");
const logger = require("../utils/logger");

module.exports = (io, socket, onlineUsers) => {
  /**
   * Client join "room" percakapan supaya bisa nerima pesan real-time
   * khusus untuk percakapan itu (tanpa perlu broadcast ke semua orang).
   * Dipanggil frontend begitu user buka halaman chat tertentu.
   */
  socket.on("join_conversation", (conversationId) => {
    socket.join(`conversation:${conversationId}`);
  });

  socket.on("leave_conversation", (conversationId) => {
    socket.leave(`conversation:${conversationId}`);
  });

  /**
   * Kirim pesan baru. Payload: { conversationId, senderId, text, image? }
   */
  socket.on("send_message", async (payload) => {
    try {
      const { conversationId, senderId, text, image } = payload;

      const message = await sendMessage({
        conversationId,
        senderId,
        text,
        image,
      });

      // Populate sender supaya frontend langsung dapat nama/avatar tanpa fetch ulang
      await message.populate("sender", "name avatarUrl");

      // Kirim ke semua client yang sedang "join" room percakapan ini
      // (termasuk pengirimnya sendiri -- frontend bisa render dari sini,
      // tidak perlu optimistic update manual).
      io.to(`conversation:${conversationId}`).emit("new_message", message);

      // Kirim notifikasi ke peserta lain yang mungkin TIDAK sedang buka
      // halaman chat ini (tidak join room), tapi lagi online -- misal
      // untuk munculkan badge notifikasi di navbar.
      const conversation = await Conversation.findById(conversationId).lean();
      if (conversation) {
        const otherParticipants = conversation.participants.filter(
          (id) => id.toString() !== senderId,
        );

        for (const participantId of otherParticipants) {
          const targetSocketId = onlineUsers.get(participantId.toString());
          if (targetSocketId) {
            io.to(targetSocketId).emit("new_message_notification", {
              conversationId,
              message,
            });
          }
        }
      }
    } catch (err) {
      logger.error("Error saat handle event 'send_message':", err.message);
      socket.emit("message_error", { message: "Gagal mengirim pesan" });
    }
  });

  /**
   * Indikator "sedang mengetik..."
   */
  socket.on("typing", ({ conversationId, userId }) => {
    socket.to(`conversation:${conversationId}`).emit("user_typing", { userId });
  });

  socket.on("stop_typing", ({ conversationId, userId }) => {
    socket
      .to(`conversation:${conversationId}`)
      .emit("user_stop_typing", { userId });
  });

  socket.on("disconnect", () => {});
};
