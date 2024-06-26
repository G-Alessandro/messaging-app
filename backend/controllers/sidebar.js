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
    const userId = req.user_id;

    const user = await UserAccount.findById(userId, "friends");

    const userFriendsArray = user ? user.friends : [];
    const userFriends = await UserAccount.find({
      _id: { $in: userFriendsArray },
    });

    const excludedUsers = [userId, ...userFriendsArray];
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
    const userId = req.user_id;
    const newFriendId = req.body.friendIdData;
    await UserAccount.findByIdAndUpdate(userId, {
      $addToSet: { friends: newFriendId },
    });
    res.status(200).json({ message: "Friend added!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "An error occurred while adding a friend.",
    });
  }
});
