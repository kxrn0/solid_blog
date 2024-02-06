const Post = require("../models/post");

exports.get_comment = async (req, res) => {
  const commentId = req.params.commentId;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) return res.status(404).json({ message: "Fuck!" });

    res.json({ comment });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Fuck!" });
  }
};
