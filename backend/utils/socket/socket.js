const UserAccount = require("../../models/user-account");
const Chat = require("../../models/chat");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Nuovo client connesso");

    socket.on("user_connected", async ({ userId }) => {
      await UserAccount.findByIdAndUpdate(userId, { online: true });
      console.log(`Utente ${userId} connesso`);
    });

    socket.on("join_room", async ({ userId, roomId }) => {
      socket.join(roomId);
      console.log(`${userId} si è unito alla stanza ${roomId}`);
    });

    socket.on("send_message", async ({ roomId, message }) => {
      
      io.to(roomId).emit("receive_message", message);
      const chat = await Chat.findById(roomId);
      chat.messages.push(message);
      await chat.save();
    });

    socket.on("user_disconnected", async ({ userId }) => {
      await UserAccount.findByIdAndUpdate(userId, { online: false });
      console.log(`Utente ${userId} disconnesso`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

module.exports = socketHandler;
