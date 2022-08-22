const {
  createPost,
  getPost,
  likePost,
  commentPost,
  fetchUserPost,
  getSinglePost,
  deletePost,
  updatePost,
} = require("../../../controllers/post.controller");
const Post = require("../../../models/post.model");

const router = require("express").Router();

router.post("/createPost", createPost);

// fetch all posts for the user
router.get("/getPost", getPost);

// fetch user post
router.get("/getUserPost",fetchUserPost)

// fetch single post by postID
router.get('/getUserPost/:postId',getSinglePost)

// delete post by postID
router.delete("/deleteUserPost/:postId",deletePost)

// update post using PostID
router.patch("/updatePost/:postId",updatePost)

// like/dislike post
router.patch("/postLike/:postId", likePost);

// comment on post
router.patch("/postComment/:postId", commentPost);

module.exports = router;
