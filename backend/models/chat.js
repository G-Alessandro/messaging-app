const mongoose = require("mongoose");

const { Schema } = mongoose;

const MessageSchema = new Schema({
  userId: { type: [Schema.Types.ObjectId], ref: "user-account" },
  userName: {
    type: String,
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  text: {
    type: String,
    trim: true,
  },
  image: {
    url: {
      type: String,
    },
    public_id: {
      type: String,
    },
  },
});

const ChatSchema = new Schema({
  usersId: { type: [Schema.Types.ObjectId], ref: "user-account", default: []},
  messages: {
    type: [MessageSchema],
    default: [],
  },
});

module.exports = mongoose.model("Chat", ChatSchema, "chat");
