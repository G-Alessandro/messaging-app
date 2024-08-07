const express = require("express");

const router = express.Router();
const authentication_controllers = require("../controllers/authentication");
const general_chat_controllers = require("../controllers/general-chat");
const user_profile_controllers = require("../controllers/user-profile");
const chat_room_controllers = require("../controllers/chat-room");

// Authentication Controllers
router.post("/sign-in", authentication_controllers.sign_in_post);

router.post("/sign-up", authentication_controllers.sign_up_post);

router.get(
  "/authentication-check",
  authentication_controllers.authentication_check_get
);

router.get("/logout", authentication_controllers.logout_get);

// General Chat Controllers
router.get("/general-chat", general_chat_controllers.general_chat_get);

router.post("/add-friend", general_chat_controllers.add_friend_post);

router.delete("/remove-friend", general_chat_controllers.remove_friend_delete);

router.get("/group-chat", general_chat_controllers.group_chat_get);

router.post(
  "/create-group-chat",
  general_chat_controllers.create_group_chat_post
);

// Chat Room controllers
router.post("/chat-room", chat_room_controllers.chat_room_post);

router.post("/chat-room-image", chat_room_controllers.chat_room_image_post);

// User Profile Controllers
router.get("/user-profile", user_profile_controllers.user_profile_data_get);

router.post(
  "/user-profile-image",
  user_profile_controllers.user_profile_image_post
);

router.post(
  "/user-profile-info",
  user_profile_controllers.user_profile_info_post
);

module.exports = router;
