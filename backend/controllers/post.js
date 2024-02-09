const Post = require("../models/post");
const Comment = require("../models/comment");
const Tracker = require("../models/tracker");
const bcrypt = require("bcrypt");
const tripcode = require("tripcode");

exports.get_posts = async (req, res) => {
  let page = Number(req.query.page) || 1;
  let isHome = !!req.query.isHome;

  const itemsPerPage = 5;
  const skip = (page - 1) * itemsPerPage;

  if (!isHome && !req.ownerId)
    return res.status(401).json({ message: "Fuck!" });

  try {
    const posts = await Promise.all(
      (
        await Post.find({ isPublished: isHome })
          .skip(skip)
          .limit(itemsPerPage)
          .sort({ createdAt: -1 })
      ).map(async (post) => {
        const commentCount = await Comment.countDocuments({ post: post._id });
        const body = post.body.substring(0, 500);

        return { ...post._doc, commentCount, body };
      })
    );
    const postCount = await Post.countDocuments({ isPublished: isHome });
    const totalPages = Math.ceil(postCount / itemsPerPage);

    res.json({ posts, totalPages, newToken: req.newToken });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Fuck!" });
  }
};

exports.get_post = async (req, res) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Fuck!" });

    const commentCount = await Comment.countDocuments({ post: post._id });

    res.json({ post, commentCount, newToken: req.newToken });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Fuck!", newToken: req.newToken });
  }
};

exports.patch_post = async (req, res) => {
  const postId = req.params.postId;

  if (!req.ownerId) return res.status(401).json({ message: "Fuck!" });

  const title = req.body.title?.trim();
  const body = req.body.body?.trim();
  const isPublished = !!req.body.isPublished;

  if (!title || !body) return res.status(400).json({ message: "Fuck!" });

  const post = await Post.findById(postId);

  if (!post) return res.status(404).json({ message: "Fuck!" });

  post.title = title;
  post.body = body;
  post.isPublished = isPublished;

  await post.save();

  res.json(post);
};

exports.delete_post = async (req, res) => {
  const postId = req.params.postId;

  if (!req.ownerId) return res.status(401).json({ message: "Fuck!" });

  try {
    await Promise.all([
      Post.findByIdAndDelete(postId),
      Comment.deleteMany({ post: postId }),
    ]);

    res.json({ message: "true", newToken: req.newToken });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Fuck!", newToken: req.newToken });
  }
};

exports.post_vote = async (req, res) => {
  const postId = req.params.postId;
  const upvote = req.body.upvote || 0;
  const downvote = req.body.downvote || 0;

  try {
    const post = await Post.findById(postId);

    post.upvotes += upvote;
    post.downvotes += downvote;

    await post.save();

    res.json({ message: "Fuck!", newToken: req.newToken });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Fuck!" });
  }
};

exports.post_post = async (req, res) => {
  const title = req.body.title?.trim();
  const body = req.body.body?.trim();
  const isPublished = !!req.body.isPublished;

  if (!req.ownerId) return res.status(401).json({ message: "Fuck!" });

  if (!title || !body) return res.status(400).json({ message: "Fuck!" });

  try {
    const post = new Post({ title, body, isPublished });

    await post.save();

    res.json({ post, newToken: req.newToken });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Fuck!", newToken: req.newToken });
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

    return res.json({ comments, newToken: req.newToken });
  } catch (error) {
    console.log(error);
  }
};

exports.post_comment = async (req, res) => {
  const name = req.body.name?.trim() || "Anonymous";
  const trip = req.body.trip || "";
  const body = req.body.body?.trim();
  const password = req.body.password?.trim() || crypto.randomUUID();
  const postId = req.params.postId;
  const isByOwner = !!req.ownerId;

  if (!body) return res.status(400).json({ message: "Fuck!" });

  try {
    const post = await Post.findById(postId);

    if (!post) return res.status(400).json({ message: "Fuck!" });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const tracker = await Tracker.findOne();
    const number = tracker.number + 1;
    const comment = new Comment({
      name,
      trip,
      body,
      post: post._id,
      password: hash,
      number,
      isByOwner,
    });

    tracker.number = number;

    await Promise.all([comment.save(), tracker.save()]);

    const tripped = trip ? tripcode(trip) : "";

    res.json({
      comment: {
        ...comment._doc,
        password: "",
        trip: tripped,
      },
      newToken: req.newToken,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.delete_comment = async (req, res) => {
  const commentId = req.params.commentId;
  const password = req.body.password?.trim();

  if (!password && !req.ownerId)
    return res.status(401).json({ message: "Fuck!" });

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) return res.status(404).json({ message: "Fuck!" });

    let hasPermision;

    if (req.ownerId) hasPermision = true;
    else hasPermision = await bcrypt.compare(password, comment.password);

    if (!hasPermision) return res.status(401).json({ message: "Fuck!" });

    await Comment.findByIdAndDelete(commentId);

    res.json({ message: "true", newToken: req.newToken });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Fuck!" });
  }
};

exports.patch_comment = async (req, res) => {
  const commentId = req.params.commentId;
  const password = req.body.password?.trim();

  if (!password || !req.ownerId)
    return res.status(401).json({ message: "Fuck!" });

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) return res.status(404).json({ message: "Fuck!" });

    let hasPermision;

    if (req.ownerId && comment.isByOwner) hasPermision = true;
    else hasPermision = await bcrypt.compare(comment.password, password);

    if (!hasPermision) return res.status(401).json({ message: "Fuck!" });

    const name = req.body.name?.trim() || "Anonymous";
    const trip = req.body.trip || "";
    const body = req.body.body?.trim();

    if (!body) return res.status(400).json({ message: "Fuck!" });

    comment.name = name;
    comment.trip = trip;
    comment.body = body;

    await comment.save();

    res.json({ comment, newToken: req.newToken });
  } catch (error) {
    console.log(error);

    req.status(500).json({ message: "Fuck!" });
  }
};
