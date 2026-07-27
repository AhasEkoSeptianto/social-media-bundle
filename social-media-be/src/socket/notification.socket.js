module.exports = (io, socket) => {
  socket.on("notification", (data) => {
    io.emit("notification", data);
  });
};
