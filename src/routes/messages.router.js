const express = require("express");
const router = express.Router();
const messageControllers = require("../controllers/messageController.js");
const userDTO = require("../dao/DTOs/user.dto.js");

const {
  isAuthenticated,
  isNotAuthenticated,
  isAdmin,
  isUser,
} = require("../middleware/auth.js");


router.get("/messages", isUser, messageControllers.getMessages);


router.post("/messages", isUser, messageControllers.createMessage);


router.delete("/messages/:uid", messageControllers.deleteMessage);

module.exports = router;