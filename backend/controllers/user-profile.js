const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const he = require("he");
const fs = require('fs');
const cloudinary = require("../utils/cloudinary/cloudinary-config");
const multer = require("../utils/multer/multer");
const UserAccount = require("../models/user-account");

exports.user_profile_data_get = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const userProfile = await UserAccount.findById(
      userId,
      "firstName lastName email profileImage profileInfo"
    );

    res.status(200).json({ userProfile });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "An error occurred while searching for user profile data.",
    });
  }
});

exports.user_profile_image_post = [
  multer.single("user-image"),
  asyncHandler(async (req, res) => {

    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No file uploaded or file is not an image" });
    }

    try {
      const currentImagePublicId = req.user.profileImage.public_id;
      let newImage;

      if( currentImagePublicId === process.env.DEFAULT_PROFILE_IMAGE_PUBLIC_ID) {
        newImage = await cloudinary.uploader.upload(req.file.path, {
          folder: "messagingApp/userProfileImage",
        });
      } else {
        await cloudinary.uploader.destroy(currentImagePublicId);
        newImage = await cloudinary.uploader.upload(req.file.path, {
          folder: "messagingApp/userProfileImage",
        });
      }

      // const result = await cloudinary.uploader.upload(req.file.path, {
      //   folder: "messagingApp/userProfileImage",
      // });

      const userId = req.user._id;
      await UserAccount.findByIdAndUpdate(userId, {
        profileImage: {
          url: newImage.secure_url,
          public_id: newImage.public_id,
        },
      });

      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Error while deleting the file:", err);
        } else {
          console.log("File deleted successfully");
        }
      });

      res.status(200).json({
        message: "Image saved!",
        imageUrl: newImage.secure_url,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "An error occurred while saving the image.",
      });
    }
  }),
];

exports.user_profile_info_post = [
  body("user-info").trim().isLength({ max: 200 }).escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ error: errorsMessages });
    }
    try {
      const userId = req.user._id;
      await UserAccount.findByIdAndUpdate(userId, {
        profileInfo: he.decode(req.body["user-info"]),
      });
      res.status(200).json({ message: "Info saved!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "An error occurred while saving the info.",
      });
    }
  }),
];
