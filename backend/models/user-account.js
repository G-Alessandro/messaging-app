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
  profileImage: {
    url: {
      type: String,
    },
    public_id: {
      type: String,
    },
  },
  profileInfo: { type: String, maxLength: 200 },
  friends: {
    type: [{ type: Schema.Types.ObjectId, ref: "UserAccount" }],
    default: [],
  },
  groupChat: {
    type: [
      {
        founder: {
          type: Boolean,
          default: false,
        },
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
        groupChatImage: {
          url: {
            type: String,
          },
          public_id: {
            type: String,
          },
        },
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
