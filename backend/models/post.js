const mongoose = require("mongoose");
const PostSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    isPublished: { type: Boolean, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
