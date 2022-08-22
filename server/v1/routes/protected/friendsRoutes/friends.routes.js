const { followUnfollow } = require('../../../controllers/friends.controller');

const router = require('express').Router();



// follow/unfollow friends
router.get("/follow/:userId",followUnfollow)



module.exports = router