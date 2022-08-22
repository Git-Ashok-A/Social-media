const passport = require('passport');
const { sendMessage, allMessages } = require('../../../controllers/message.controller');

const router = require('express').Router();

// send message
router.post("/",sendMessage)

// get all the messages based on chatID
router.get("/:chatId",allMessages);



module.exports = router