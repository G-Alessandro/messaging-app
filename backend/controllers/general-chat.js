const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const fs = require("fs");
const cloudinary = require("../utils/cloudinary/cloudinary-config");
const multer = require("../utils/multer/multer");

const UserAccount = require("../models/user-account");

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
    })
      .select("firstName lastName profileImage online")
      .sort({
        online: -1,
        firstName: 1,
        lastName: 1,
      });

    let allUsers = await UserAccount.find(
      { _id: { $ne: userId } },
      "firstName lastName profileImage online"
    ).sort({
      online: -1,
      firstName: 1,
      lastName: 1,
    });
    
    allUsers = [...allUsers, ...groupChat.groupChat];


    return res.status(200).json({ userId, userFriends, groupChat, allUsers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "An error occurred while searching for users.",
    });
  }
});

exports.create_group_chat_post = [
  multer.single("group-image"),
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
    .customSanitizer((value) => {
      try {
        return JSON.parse(value);
      } catch (err) {
        throw new Error("Invalid format for groupChatUsers");
      }
    })
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
      let newImage;

      if (req.file) {
        newImage = await cloudinary.uploader.upload(req.file.path, {
          folder: "messagingApp/userProfileImage",
        });
      }

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
                url: newImage
                  ? newImage.secure_url
                  : process.env.DEFAULT_PROFILE_IMAGE_URL,
                public_id: newImage
                  ? newImage.public_id
                  : process.env.DEFAULT_PROFILE_IMAGE_PUBLIC_ID,
              },
            },
          },
        });
      }

      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error("Error while deleting the file:", err);
          } else {
            console.log("File deleted successfully");
          }
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
