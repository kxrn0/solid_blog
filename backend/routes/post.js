const express = require("express");
const router = express.Router();
const controller = require("../controllers/post");

router.get("/", controller.get_posts);

router.get("/:postId", controller.get_post);

router.get("/:postId/comments/", controller.get_post_comments);

router.post("/:postId", controller.post_comment);

router.delete("/:postId/comments/:commentId", controller.delete_comment);

router.patch("/:postId/comments/:commentId", controller.patch_comment);

module.exports = router;
