const Following = require("../models/following.model");
const Post = require("../models/post.model");

// createPost
module.exports.createPost = async(req,res)=>{
    const {image,hashtags,caption} = req.body;
    const userId = req.user._id;
    try {
        const createdPost = await Post.create({
            image,
            caption,
            hashtags,
            author:userId
        });
        const post = await Post.findById(createdPost._id)
                    .populate("author","username name profilePic")
                    .populate("likes.author","username name profilePic")
                    .populate("comments.author","username name profilePic")
        res.status(201).json({success:true,post:post,likes:[],comments:[]});
    } catch (error) {
        console.log(error.message);
        res.status(400).send({error:"Can't post feed try later"})
    }
}

// fetch current user post
module.exports.fetchUserPost = async(req,res)=>{
  const userId = req.user._id;
  try {
    const post = await Post.find({author:userId})
                .populate("likes.author","username name profilePic")
                .populate("comments.author","username name profilePic")

    res.status(200).json({success:true,posts:post})
  } catch (error) {
    res.status(400).json({success:false,error:"Something went wrong while fetching posts"})
  }
}

// get single post by postID
module.exports.getSinglePost = async(req,res)=>{
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId)
                .populate("author","username name profilePic")
                .populate("likes.author","username name profilePic")
                .populate("comments.author","username name profilePic")
    if(post){
      res.status(200).json({success:true,post:post})
    }else{
      res.status(200).json({success:false,error:"Post not found!"})
    }
  } catch (error) {
    res.status(400).json({success:false,error:"Something went wrong!"})
  }
}

// get all the post for the current user (own post and following user's post)
module.exports.getPost = async(req,res)=>{
    const userId = req.user._id;
    try {
        const result = await Following.findOne({user:userId},"following")
        const folowingIds = result.following.map(f=>{
            return( f.user.toString());
        })
        const posts = await Post.find({author:{$in:[userId,...folowingIds]}})
                                .populate("author",'username name profilePic')
                                .populate('likes.author','profilePic username name')
                                .populate('comments.author','profilePic username name')
                                .sort([['createdAt',-1]])
        return res.status(200).json({success:true,posts:posts})
    } catch (error) {
        console.log(error);
        return res.status(400).json({success:false,error:"Something went wrong while fetching posts."})
    }
}

// like and dislike post
module.exports.likePost = async(req,res)=>{
    const postId = req.params.postId;
    const userId = req.user._id;
    try {
        const postLike = await Post.updateOne(
            {_id:postId,'likes.author':{$ne:userId}},
            {
                $push:{likes:{author:userId}}
            },
            {new:true}
            
            )
        let likedPost = await Post.findById(postId)
                            .populate("likes.author","username name profilePic")
        if(postLike.modifiedCount===0){
            const postDislike = await Post.findByIdAndUpdate(postId,
                {$pull:{likes:{author:userId}}},
                {new:true}
            );
            return res.status(200).json({success:true,operation:"dislike",post:postDislike})
        }
        else{
            return res.status(200).json({success:true,operation:"like",post:likedPost})
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({success:false,error:"Something went wrong try later!"});
    }
}

// comment the post
module.exports.commentPost = async(req,res)=>{
    const message = req.body.comment;
    const postId = req.params.postId;
    const userId = req.user._id;
    const comment = {
        comment:message,
        author: userId
    }
    try {
        const postComment = await Post.findByIdAndUpdate(postId,
            {$push:{comments:comment}},
            {new:true}
            ).populate("comments.author","username name profilePic")
        return res.status(200).json({success:true,post:postComment})
    } catch (error) {
        res.status(200).json({success:false,error:"Can't post comment to this post"})
        
    }
}

module.exports.updatePost = async(req,res)=>{
  const {caption,hashtags} = req.body;
  const postId = req.params.postId;
  const userId = req.user._id;
  try {
    const updatedPost = await Post.findOneAndUpdate({
      $and:[
        {_id:postId},
        {author:userId}
      ]
    },
    {caption,hashtags},
    {new:true}
    )
    
    if(updatedPost){
      res.status(200).json({success:true,updatedPost})
    }
    else{
      res.status(200).json({success:false,message:"User Cannot update this post!"})
    }
  } catch (error) {
    res.status(400).json({success:false,error:"Something went wrong!"})
  }

}

// delete the post
module.exports.deletePost = async(req,res)=>{
  const postId = req.params.postId;
  const userId = req.user._id;
  try {
    const deletedPost = await Post.findOneAndDelete({
      $and:[
        {_id:postId},
        {author:userId}
      ]
    })
    
    if(deletedPost){
      res.status(200).json({success:true,deletedPost})
    }
    else{
      res.status(200).json({success:false,message:"User Cannot delete this post!"})
    }
  } catch (error) {
    res.status(400).json({success:false,error:"Something went wrong!"})
  }

}