const { getFriendOnlineListService } = require("../services/socket.service");

async function getListFiendOnline(user_id) {
  const list_friend_online = await getFriendOnlineListService(user_id);

  return list_friend_online;
}

module.exports = { getListFiendOnline };
