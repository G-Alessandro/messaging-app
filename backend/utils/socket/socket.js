const UserAccount = require("../../models/user-account");
const Chat = require("../../models/chat");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    socket.on("user_connected", async ({ userId }) => {
      await UserAccount.findByIdAndUpdate(userId, { online: true });
    });

    socket.on("join_room", async ({ userId, roomId }) => {
      socket.join(roomId);
    });

    socket.on("send_message", async ({ roomId, message }) => {
      io.to(roomId).emit("receive_message", message);
      const chat = await Chat.findById(roomId);
      chat.messages.push(message);
      await chat.save();
    });

    socket.on("user_disconnected", async ({ userId }) => {
      await UserAccount.findByIdAndUpdate(userId, { online: false });
    });

    socket.on("disconnect");
  });
};

module.exports = socketHandler;
