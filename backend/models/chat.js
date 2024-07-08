const mongoose = require("mongoose");

const { Schema } = mongoose;

const MessageSchema = new Schema({
  userName: {
    type: String,
    trim: true,
  },
  textDate: {
    type: Date,
    default: Date.now,
  },
  text: {
    type: String,
    minLength: 1,
    trim: true,
  },
  image: {
    type: String,
  },
});

const ChatSchema = new Schema({
  usersId: { type: [Schema.Types.ObjectId], ref: "user-account", default: [] },
  messages: {
    type: [MessageSchema],
    default: [],
  },
});

module.exports = mongoose.model("Chat", ChatSchema, "chat");
