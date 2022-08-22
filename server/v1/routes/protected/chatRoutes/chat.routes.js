const passport = require('passport');
const { accessChat, fetchChats } = require('../../../controllers/chat.controller');

const router = require('express').Router();

// access the chat or create
router.post("/",accessChat)

// fetch all the chats
router.get("/",fetchChats)



module.exports = router