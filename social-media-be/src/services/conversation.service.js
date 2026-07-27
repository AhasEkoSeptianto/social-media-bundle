const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");

/**
 * Cari percakapan 1-on-1 antara 2 user. Kalau belum ada, buat baru.
 * Participants diurutkan (sort by string) supaya [A,B] dan [B,A]
 * selalu dianggap percakapan yang sama, tidak dobel.
 */
async function findOrCreateConversation(userIdA, userIdB) {
  const participants = [userIdA, userIdB].sort();

  let conversation = await Conversation.findOne({
    participants: { $all: participants, $size: 2 },
  });

  if (!conversation) {
    conversation = await Conversation.create({ participants });
  }

  return conversation;
}

/**
 * Kirim pesan baru + update cache lastMessage di Conversation.
 */
async function sendMessage({ conversationId, senderId, text, image }) {
  const message = await Message.create({
    conversation: conversationId,
    sender: senderId,
    text,
    image,
    readBy: [senderId], // pengirim otomatis dianggap sudah "membaca" pesannya sendiri
  });

  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: { text, sender: senderId, sentAt: message.createdAt },
  });

  return message;
}

/**
 * Ambil daftar pesan dalam 1 percakapan, dengan pagination.
 */
async function getMessages({ conversationId, page = 1, limit = 30 }) {
  const skip = (page - 1) * limit;

  const messages = await Message.find({ conversation: conversationId })
    .sort({ createdAt: -1 }) // terbaru dulu, nanti di-reverse di frontend untuk tampilan chat
    .skip(skip)
    .limit(limit)
    .populate("sender", "name avatarUrl");

  return messages;
}

/**
 * Ambil daftar percakapan (inbox) milik seorang user, urut dari yang terakhir aktif.
 */
async function getConversationsByUser(userId) {
  return Conversation.find({ participants: userId })
    .sort({ updatedAt: -1 })
    .populate("participants", "name avatarUrl");
}

module.exports = {
  findOrCreateConversation,
  sendMessage,
  getMessages,
  getConversationsByUser,
};
