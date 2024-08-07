const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const fs = require("fs");
const cloudinary = require("../utils/cloudinary/cloudinary-config");
const mongoose = require("mongoose");
const multer = require("../utils/multer/multer");
const UserAccount = require("../models/user-account");
const Chat = require("../models/chat");

exports.chat_room_post = [
  body("chatUserId")
    .isArray()
    .isLength({ min: 1 })
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
      const chatUsers = req.body.chatUserId;
      const allChatUsers = [...chatUsers, userId];

      const userData = await UserAccount.findById(
        userId,
        "_id firstName lastName"
      );

      let chatRoomUserData = await Promise.all(
        chatUsers.map((userId) =>
          UserAccount.findById(userId, "firstName lastName profileImage")
        )
      );

      if (chatUsers.length > 2) {
        const groupChatInfo = await UserAccount.findOne({
          _id: userId,
          "groupChat.groupChatUsers": { $all: chatUsers },
        });
        chatRoomUserData = [...chatRoomUserData, groupChatInfo];
      }

      const findChat = async () => {
        const chat = await Chat.findOne({
          usersId: { $all: allChatUsers },
        });

        if (!chat) {
          const newChat = new Chat({
            usersId: allChatUsers,
            messages: [],
          });

          await newChat.save();
          return newChat;
        } else {
          return chat;
        }
      };

      const chatData = await findChat();

      return res.status(200).json({ chatData, userData, chatRoomUserData });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "An error occurred while retrieving the chat.",
      });
    }
  }),
];

exports.chat_room_image_post = [
  multer.single("message-image"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No file uploaded or file is not an image" });
    }

    try {
      const newImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "messagingApp/chatImages",
      });

      await fs.promises.unlink(req.file.path);

      res.status(200).json({
        image: {
          url: newImage.secure_url,
          public_id: newImage.public_id,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "An error occurred while saving the image.",
      });
    }
  }),
];
