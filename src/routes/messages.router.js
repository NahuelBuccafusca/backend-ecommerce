const express = require("express");
const router = express.Router();
const messageControllers = require("../controllers/messageController.js");

const {
  isUser,
} = require("../middleware/auth.js");


router.get("/messages", isUser, messageControllers.getMessages);


router.post("/messages", isUser, messageControllers.createMessage);


router.delete("/messages/:uid", messageControllers.deleteMessage);

module.exports = router;