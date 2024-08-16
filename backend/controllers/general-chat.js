const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const UserAccount = require("../models/user-account");
const Chat = require("../models/chat");

exports.general_chat_get = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorsMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ error: errorsMessages });
  }

  try {
    const userId = req.user._id;
    const user = await UserAccount.findById(userId, "friends");
    const groupChat = await UserAccount.findById(userId, "groupChat");
    const userFriends = await UserAccount.find({
      _id: { $in: user.friends },
    });

    const excludedUsers = [userId, ...user.friends];
    const allUsers = await UserAccount.find(
      { _id: { $nin: excludedUsers } },
      "_id firstName lastName profileImage online"
    );

    return res.status(200).json({ userId, userFriends, groupChat, allUsers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "An error occurred while searching for users.",
    });
  }
});


exports.create_group_chat_post = [
  body("groupChatName")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Group chat name is required")
    .escape()
    .custom(async (value, { req }) => {
      const userId = req.user._id;
      const user = await UserAccount.findOne({
        _id: userId,
        groupChat: { $elemMatch: { groupChatName: value } },
      });

      if (user) {
        throw new Error("Group chat name is already in use");
      }
    }),
  body("groupChatUsers")
    .isArray()
    .isLength({ min: 1 })
    .withMessage("Group chat must contain at least one user")
    .custom((value) => {
      for (let i = 0; i < value.length; i++) {
        if (!mongoose.Types.ObjectId.isValid(value[i])) {
          throw new Error("Invalid user ID");
        }
      }
      return true;
    }),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map((error) => error.msg);
      console.log(errorsMessages);
      return res.status(400).json({ error: errorsMessages });
    }

    try {
      const userId = req.user._id;
      const { groupChatName, groupChatUsers } = req.body;

      groupChatUsers.push(userId);

      for (let i = 0; i < groupChatUsers.length; i++) {
        const usersId = groupChatUsers[i];
        const groupChatUserRemoved = groupChatUsers.filter(
          (id) => id !== usersId
        );

        await UserAccount.findByIdAndUpdate(usersId, {
          $push: {
            groupChat: {
              founder: usersId === userId ? true : false,
              groupChatName: groupChatName,
              groupChatUsers: groupChatUserRemoved,
              groupChatImage: {
                url: process.env.DEFAULT_PROFILE_IMAGE_URL,
                public_id: process.env.DEFAULT_PROFILE_IMAGE_PUBLIC_ID,
              },
            },
          },
        });
      }
      res.status(200).json({ message: "Group chat created!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "An error occurred while creating the group chat.",
      });
    }
  }),
];
