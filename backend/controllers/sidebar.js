const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const UserAccount = require("../models/user-account");

exports.general_chat_get = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorsMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ errors: errorsMessages });
  }

  try {
    const userId = req.user._id;
    const user = await UserAccount.findById(userId, "friends");

    const userFriends = await UserAccount.find({
      _id: { $in: user.friends },
    });

    const excludedUsers = [userId, ...user.friends];
    const allUsers = await UserAccount.find(
      { _id: { $nin: excludedUsers } },
      "_id firstName lastName online"
    );

    return res.status(200).json({ userFriends, allUsers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "An error occurred while searching for other users.",
    });
  }
});

exports.add_friend_post = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorsMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ errors: errorsMessages });
  }

  try {
    const userId = req.user._id;
    const friendId = req.body.friendId;
    await UserAccount.findByIdAndUpdate(userId, {
      $addToSet: { friends: friendId },
    });
    res.status(200).json({ message: "Friend added!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "An error occurred while adding a friend.",
    });
  }
});

exports.remove_friend_delete = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const friendId = req.body.friendId;
    await UserAccount.findByIdAndUpdate(userId, {
      $pull: { friends: friendId },
    });
    res.status(200).json({ message: "Friend removed!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "An error occurred while removing the friend.",
    });
  }
});
