const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const cloudinary = require("../utils/cloudinary/cloudinary-config");
const UserAccount = require("../models/user-account");
const Chat = require("../models/chat");

exports.add_friend_post = [
  body("friendId")
    .notEmpty()
    .withMessage("Friend Id must be provided")
    .isMongoId()
    .withMessage("Invalid user ID"),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ error: errorsMessages });
    }

    try {
      const userId = req.user._id;
      const friendId = req.body.friendId;
      await UserAccount.findByIdAndUpdate(userId, {
        $addToSet: { friends: friendId },
      });
      await UserAccount.findByIdAndUpdate(friendId, {
        $addToSet: { friends: userId },
      });
      res.status(200).json({ message: "Friend added!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "An error occurred while adding a friend.",
      });
    }
  }),
];

exports.remove_friend_delete = [
  body("removedFriendId")
    .notEmpty()
    .withMessage("Friend Id must be provided")
    .isMongoId()
    .withMessage("Invalid user ID"),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ error: errorsMessages });
    }
    try {
      const userId = req.user._id;
      const removedFriendId = req.body.removedFriendId;
      await UserAccount.findByIdAndUpdate(userId, {
        $pull: { friends: removedFriendId },
      });
      await UserAccount.findByIdAndUpdate(removedFriendId, {
        $pull: { friends: userId },
      });
      res.status(200).json({ message: "Friend removed!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "An error occurred while removing the friend.",
      });
    }
  }),
];

exports.delete_group_delete = [
  body("deletedGroupId")
    .notEmpty()
    .withMessage("Group Id must be provided")
    .isMongoId()
    .withMessage("Invalid user ID"),
  body("founder")
    .notEmpty()
    .withMessage("Founder must be provided")
    .isBoolean()
    .withMessage("Founder field must be a boolean value"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ error: errorsMessages });
    }
    try {
      const userId = req.user._id;
      const groupToDeleteId = req.body.deletedGroupId;
      const isFounder = req.body.founder;
      let messageResult;

      const userAccount = await UserAccount.findById(userId);

      const groupToDelete = userAccount.groupChat.find(
        (group) => group._id.toString() === groupToDeleteId
      );

      const groupToDeleteName = groupToDelete.groupChatName;

      const groupToDeleteUsersId = groupToDelete.groupChatUsers;

      const groupToDeleteImagePublicId = groupToDelete.groupChatImage.public_id;

      const groupToDeleteAllUsersId = [...groupToDeleteUsersId, userId];

      if (isFounder) {
        for (const user of groupToDeleteAllUsersId) {
          const groupChatUserRemoved = groupToDeleteAllUsersId.filter(
            (id) => !id.equals(user)
          );
          await UserAccount.findByIdAndUpdate(user, {
            $pull: {
              groupChat: {
                groupChatName: groupToDeleteName,
                groupChatUsers: { $all: groupChatUserRemoved },
              },
            },
          });
        }

        const groupChat = await Chat.findOne({ groupChatId: groupToDeleteId });

        if (groupChat) {
          const destroyPromises = groupChat.messages.map(async (message) => {
            const messageImagePublicId = message?.image?.public_id;
            if (messageImagePublicId) {
              return cloudinary.uploader.destroy(messageImagePublicId);
            }
          });
          await Promise.all(destroyPromises);
        }

        await Chat.findOneAndDelete({ groupChatId: groupToDeleteId });

        if (groupToDeleteImagePublicId !== process.env.DEFAULT_PROFILE_IMAGE_PUBLIC_ID) {
          await cloudinary.uploader.destroy(groupToDeleteImagePublicId);
        }

        messageResult = "Group deleted!";
      } else {
        for (const user of groupToDeleteUsersId) {
          const groupChatUserRemoved = groupToDeleteAllUsersId.filter(
            (id) => !id.equals(user)
          );

          await UserAccount.findOneAndUpdate(
            {
              _id: user,
              "groupChat.groupChatName": groupToDeleteName,
              "groupChat.groupChatUsers": { $all: groupChatUserRemoved },
            },
            {
              $pull: {
                "groupChat.$.groupChatUsers": userId,
              },
            }
          );
          await Chat.findOneAndUpdate(
            { groupChatId: groupToDeleteId },
            {
              $pull: {
                usersId: userId,
              },
            }
          );
        }

        await UserAccount.findByIdAndUpdate(userId, {
          $pull: { groupChat: { _id: groupToDeleteId } },
        });

        messageResult = "You left the group!";
      }

      res.status(200).json({ message: messageResult });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "An error occurred while deleting the group.",
      });
    }
  }),
];
