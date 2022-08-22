const passport = require('passport');
const User = require('../../../models/user.model');
const upload = require('../../../utils/imageStorage');
const router = require('express').Router();
const fs = require('fs');
const path = require("path");
const sharp = require('sharp');
const Followers = require('../../../models/followers.model');
const Following = require('../../../models/following.model');
const Post = require('../../../models/post.model');
const { getCurrentUser, getOtherUsers, findUser, getFollowers, getFollowing, suggestUser, searchElement } = require('../../../controllers/user.controller');



// get current user details
router.get('/getUser',getCurrentUser)

// get all other users expect current user
router.get("/getAllUsers",getOtherUsers)

// findUser
router.get('/findUsers',findUser)

// update user's details - bio,name,profilePic
router.put('/updateUser',upload.single('profilePic'),(req,res)=>{
    const {name,bio,profilePic} = req.body;
    const inputData ={};
    inputData.name = name;
    inputData.bio = bio;    
    inputData.profilePic = profilePic
    // if(req.file){
    //     inputData.profilePic = {
    //         data:fs.readFileSync(path.join(__dirname,"../../..",req.file.path)),
    //         contentType:'image/jpeg' 
    //     }
    // }
    
    const userId = req.user._id;
    User.findByIdAndUpdate(userId,inputData)
    .then((data)=>{
        console.log("updated data");
        res.status(200).json({
            success:true,
            user:data
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(424).json({
            success:false,
            error:err
        })
    })
})

// get all followers for current user
router.get('/getFollowers',getFollowers)

// get all following for current user
router.get('/getFollowing',getFollowing)

// suggest user
router.get('/suggestUser',suggestUser)

// fetch results based on the search element
router.get('/search/:element',searchElement)

module.exports = router