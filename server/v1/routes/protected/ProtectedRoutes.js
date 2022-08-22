const passport = require('passport')
const router = require('express').Router();

// test page
router.get('/home',(req,res)=>{
    res.send("Protected page")
})

// user routes
router.use('/user',require('./userRoutes/user.routes'))

// chat routes
router.use('/chat',require("./chatRoutes/chat.routes"))

// message routes
router.use('/message',require("./chatRoutes/messages.routes"))

// friends routes
router.use('/friends',require('./friendsRoutes/friends.routes'))

// post routes
router.use('/post',require('./postRoutes/post.routes'))



module.exports = router;