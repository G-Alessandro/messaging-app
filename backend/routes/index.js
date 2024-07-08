const express = require("express");

const router = express.Router();
const authentication_controllers = require("../controllers/authentication");
const sidebar_controllers = require("../controllers/sidebar");

// Authentication Controllers
router.post("/sign-in", authentication_controllers.sign_in_post);

router.post("/sign-up", authentication_controllers.sign_up_post);

router.get(
  "/authentication-check",
  authentication_controllers.authentication_check_get
);

router.get("/logout", authentication_controllers.logout_get);

// Sidebar Controllers
router.get("/general-chat", sidebar_controllers.general_chat_get);

router.post("/create-group-chat", sidebar_controllers.create_group_chat_post);

router.post("/add-friend", sidebar_controllers.add_friend_post);

router.delete("/remove-friend", sidebar_controllers.remove_friend_delete);

module.exports = router;
