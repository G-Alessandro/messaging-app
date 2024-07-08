const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserAccountSchema = new Schema({
  firstName: {
    type: String,
    minLength: 1,
    maxLength: 30,
    required: true,
  },
  lastName: {
    type: String,
    minLength: 1,
    maxLength: 30,
    required: true,
  },
  email: {
    type: String,
    minLength: 1,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minLength: 8,
    required: true,
  },
  friends: {
    type: [{ type: Schema.Types.ObjectId, ref: "UserAccount" }],
    default: [],
  },
  groupChat: {
    type: [
      {
        groupChatName: {
          type: String,
          minLength: 1,
          maxLength: 30,
          required: true,
        },
        groupChatUsers: {
          type: [{ type: Schema.Types.ObjectId, ref: "UserAccount" }],
          default: [],
        },
        chatId: { type: Schema.Types.ObjectId, ref: "chat" },
      },
    ],
    default: [],
  },
  online: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model(
  "UserAccount",
  UserAccountSchema,
  "user-account"
);
