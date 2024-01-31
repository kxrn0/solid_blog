const mongoose = require("mongoose");
const CommentSchema = mongoose.Schema(
  {
    name: { type: String, default: "Anonymous" },
    trip: { type: String, default: "" },
    body: { type: String, required: true },
    number: { type: Number, required: true },
    password: { type: String, required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
