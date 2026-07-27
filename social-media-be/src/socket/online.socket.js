const { getListFiendOnline } = require("../controllers/socket.controller");
const logger = require("../utils/logger");

/**
 * Kirim daftar teman yang online ke SATU user tertentu saja.
 */
async function sendOnlineFriendsTo(io, onlineUsers, targetUserId) {
  const socketId = onlineUsers.get(targetUserId);
  if (!socketId) return; // user ini sudah tidak online lagi

  const friendIds = await getListFiendOnline(targetUserId);
  const onlineFriends = [];

  for (const friendId of friendIds) {
    if (onlineUsers.has(friendId)) {
      onlineFriends.push(friendId);
    }
  }

  io.to(socketId).emit("list_friend_online", onlineFriends);
}

/**
 * Broadcast status "user ini baru online/offline" ke SEMUA temannya yang sedang online
 * (bukan ke semua user yang online, cuma yang berteman).
 */
async function notifyFriendsSomeoneChangedStatus(io, onlineUsers, userId) {
  const friendIds = await getListFiendOnline(userId);

  for (const friendId of friendIds) {
    if (onlineUsers.has(friendId)) {
      await sendOnlineFriendsTo(io, onlineUsers, friendId);
    }
  }
}
function removeOnlineUser(socket) {
  for (const [userId, socketId] of onlineUsers) {
    if (socketId === socket.id) {
      onlineUsers.delete(userId);
      return userId;
    }
  }

  return null;
}

module.exports = (io, socket, onlineUsers) => {
  socket.on("login", async (userId) => {
    try {
      onlineUsers.set(userId, socket.id);
      await sendOnlineFriendsTo(io, onlineUsers, userId);
      await notifyFriendsSomeoneChangedStatus(io, onlineUsers, userId);
    } catch (err) {
      logger.error("Error saat handle event 'login' socket:", err.message);
    }
  });

  socket.on("get-friend-online", async (userId) => {
    try {
      await sendOnlineFriendsTo(io, onlineUsers, userId);
    } catch (err) {
      logger.error("Error saat handle event 'get-friend-online':", err.message);
    }
  });

  socket.on("logout", async () => {
    try {
      const userId = removeOnlineUser(socket);

      if (!userId) return;

      await notifyFriendsSomeoneChangedStatus(io, onlineUsers, userId);
    } catch (err) {
      logger.error("Error saat handle event 'logout':", err.message);
    }
  });

  socket.on("disconnect", () => {
    try {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          notifyFriendsSomeoneChangedStatus(io, onlineUsers, userId).catch(
            (err) => logger.error("Error saat notify disconnect:", err.message),
          );
          break;
        }
      }
    } catch (err) {
      logger.error("Error saat handle event 'disconnect':", err.message);
    }
  });
};
