const Post = require("../models/post");
const Comment = require("../models/comment");

exports.get_posts = async (req, res) => {
  let page = Number(req.quety.page);
  let isHome = req.query.isHome;

  const itemsPerPage = 5;
  const skip = (page - 1) * itemsPerPage;

  try {
    const posts = await Post.find({ isPublished: isHome });

    //fetch comments...

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
