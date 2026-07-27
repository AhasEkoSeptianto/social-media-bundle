const {
  findOrCreateConversation,
  sendMessage,
  getMessages,
  getConversationsByUser,
} = require("../services/conversation.service");
const AppError = require("../utils/AppError");

/**
 * GET /api/chat/conversations
 * Daftar percakapan (inbox) milik user yang sedang login.
 */
async function getConversations(req, res, next) {
  try {
    const userId = req.user.id;
    const conversations = await getConversationsByUser(userId);

    res.status(200).json({ success: true, data: conversations });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/chat/conversations
 * Body: { targetUserId }
 * Buat (atau ambil yang sudah ada) percakapan 1-on-1 dengan user lain.
 */
async function startConversation(req, res, next) {
  try {
    const userId = req.user.id;
    const { targetUserId } = req.body;
    console.log(targetUserId, req.body);

    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        message: "targetUserId wajib diisi",
      });
    }

    const conversation = await findOrCreateConversation(userId, targetUserId);

    res.status(200).json({ success: true, data: conversation });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/chat/conversations/:conversationId/messages?page=1
 * Ambil pesan dalam 1 percakapan, dengan pagination.
 */
async function getConversationMessages(req, res, next) {
  try {
    const { conversationId } = req.params;
    const page = parseInt(req.query.page) || 1;

    const messages = await getMessages({ conversationId, page });

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/chat/conversations/:conversationId/messages
 * Body: { text, image? }
 * Kirim pesan lewat REST API (fallback/backup kalau socket tidak connect).
 * Alur utama pengiriman pesan realtime tetap lewat Socket.IO (lihat chat.socket.js).
 */
async function postMessage(req, res, next) {
  try {
    const { conversationId } = req.params;
    const { text, image } = req.body;
    const senderId = req.user.id;

    if (!text && !image) {
      throw new AppError("Pesan harus punya teks atau gambar", 400);
    }

    const message = await sendMessage({
      conversationId,
      senderId,
      text,
      image,
    });

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getConversations,
  startConversation,
  getConversationMessages,
  postMessage,
};
