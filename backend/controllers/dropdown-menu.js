const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const UserAccount = require("../models/user-account");

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
