const Post = require("../models/post");
const Comment = require("../models/comment");
const bcrypt = require("bcrypt");
const tripcode = require("tripcode");

exports.get_posts = async (req, res) => {
  let page = Number(req.query.page);
  let isHome = !!req.query.isHome;

  const itemsPerPage = 5;
  const skip = (page - 1) * itemsPerPage;

  try {
    const posts = await Promise.all(
      (
        await Post.find({ isPublished: isHome })
          .skip(skip)
          .limit(itemsPerPage)
          .sort({ createdAt: -1 })
      ).map(async (post) => {
        const comments = await Comment.countDocuments({ post: post._id });
        const body = post.body.substring(0, 500);

        return { ...post._doc, comments, body };
      })
    );

    res.json(posts);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Fuck!" });
  }
};

exports.get_post = async (req, res) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found!" });

    const comments = await Comment.find({ post: postId }, { password: 0 });

    res.json({ post, comments });
  } catch (error) {
    console.log(error);

    res.json({ message: "Fuck!" });
  }
};

exports.get_post_comments = async (req, res) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Fuck!" });

    const comments = (
      await Comment.find({ post: postId }, { password: 0 })
    ).map((comment) => {
      if (!comment.trip) return comment;

      const trip = tripcode(comment.trip);

      return { ...comment._doc, trip };
    });

    return res.json({ comments });
  } catch (error) {
    console.log(error);
  }
};

exports.post_comment = async (req, res) => {
  const name = req.body.name || "Anonymous";
  const trip = req.body.trip || "";
  const body = req.body.body;
  const password = req.body.password || crypto.randomUUID();
  const postId = req.params.postId;

  if (!body) return res.status(400).json({ message: "Fuck!" });

  try {
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Fuck!" });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const latestComment = await Comment.findOne().sort({ createdAt: -1 });
    const number = latestComment ? latestComment.number : 1;
    console.log({ number });
    const comment = new Comment({
      name,
      trip,
      body,
      post: post._id,
      password: hash,
      number,
    });

    await comment.save();

    res.json(comment);
  } catch (error) {
    console.log(error);
  }
};

exports.delete_comment = async (req, res) => {
  const commentId = req.params.commentId;
  const password = req.body.password;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) return res.status(404).json({ message: "Fuck!" });

    const match = await bcrypt.compare(password, comment.password);

    if (!match) return res.status(401).json({ message: "Fuck!" });

    await Comment.findByIdAndDelete(commentId);

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Fuck!" });
  }
};

exports.patch_comment = async (req, res) => {
  const commentId = req.params.commentId;
  const password = req.body.password;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) return res.status(404).json({ message: "Fuck!" });

    const match = await bcrypt.compare(password, comment.password);

    if (!match) return res.status(401).json({ message: "Fuck!" });
  
    const name = req.body.name;
    const trip = req.body.trip;
    const body = req.body.body?.trim();
    
    if (!body)
    return res.status().json()
    
    comment.name = name;
    comment.trip = trip;
    comment.body = body;
  
  } catch (error) {
    console.log(error);

    req.status(500).json({ message: "Fuck!" });
  }
};
