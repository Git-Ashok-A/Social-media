const Followers = require("../models/followers.model");
const Following = require("../models/following.model");
const Post = require("../models/post.model");
const User = require("../models/user.model");

// get Current user's details
module.exports.getCurrentUser = async(req,res)=>{
    const userId = req.user._id;
    const user = await User.findById(userId)
    res.status(200).json({
        id:userId,
        name:user.name,
        username:user.username,
        bio:user.bio,
        email:user.email,
        profilePic:user.profilePic
    })
}

// get all other users expect current user
module.exports.getOtherUsers= async(req,res)=>{
    const userId = req.user._id;
    try {
        const users = await User.find({_id:{$ne:userId}},"name username profilePic");
        res.json(users)
    } catch (error) {
        res.status(400).send("Error occured")
    }
}

// findUser
module.exports.findUser = async(req,res)=>{
    const userId = req.user._id;
    let following = [];
    let users = [];
    try {
        const result = await Following.findOne({user:userId},"following")
        const folowingIds = result.following.map(f=>{
            return( f.user.toString());
        })
        
        const userResult = await User.find({ _id: { $nin: [userId,...folowingIds] } },"username profilePic name");
        res.status(200).json({result:userResult})
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
}

// get all followers for current user
module.exports.getFollowers = async (req,res)=>{
    const user_id = req.user._id;
    try {
        let result= await Followers.findOne({user:user_id}).populate("followers.user","name username profilePic");
        const followers = [...result.followers]
        res.status(200).json(followers)
    } catch (error) {
        console.log(error.message);
        res.status(400).send({error:"Something went wrong! try later"})
    }
}

// get all following for current user
module.exports.getFollowing = async (req,res)=>{
    try {
        const user_id = req.user._id;
        let result= await Following.findOne({user:user_id}).populate("following.user","name username profilePic");
        const following = [...result.following]
        res.status(200).json(following)
    } catch (error) {
        console.log(error.message);
        res.status(400).send({error:"Something went wrong! try later"})
    }
}

// suggest User 
module.exports.suggestUser = async(req,res)=>{
    const userId = req.user._id;
    var d = new Date();
    d.setDate(d.getDate() - 1);
    try {
        const newUsers = await User.find({
            createdAt:{
                $gte: d,
                $lt: new Date()
            }
        })
        const {following} = await Following.findOne({user:userId},"following")
        let followingIds = [];
        res.status(200).json({success:true,followingIds})
    } catch (error) {
        
    }

}

// fetch results based on the search element
module.exports.searchElement = async(req,res)=>{
    const searchElement = req.params.element;
    const regex = new RegExp(searchElement)
    try {
        const hashtagResult = await Post.find(
            {"hashtags":{$regex:regex,$options:"i"}
        }
        ).populate("author","username name profilePic")
        const users = await User.find(
            {username:{$regex:regex,$options:"i"}}
            )
        res.json({hashtags:hashtagResult,users})
    } catch (error) {
        return res.status(400,{error:"Something went wrong try later"})
    }
}