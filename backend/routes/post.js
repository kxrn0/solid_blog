const express = require("express");
const router = express.Router();
const controller = require("../controllers/post");
const check_signature = require("../middleware/check_signature");

router.use(check_signature);

router.get("/", controller.get_posts);

router.post("/", controller.post_post);

router.get("/:postId", controller.get_post);

router.patch("/:postId", controller.patch_post);

router.post("/:postId", controller.post_vote);

router.delete("/:postId", controller.delete_post);

router.get("/:postId/comments/", controller.get_post_comments);

router.post("/:postId", controller.post_comment);

router.delete("/:postId/comments/:commentId", controller.delete_comment);

router.patch("/:postId/comments/:commentId", controller.patch_comment);

module.exports = router;
