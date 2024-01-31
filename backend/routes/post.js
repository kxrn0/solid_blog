const express = require("express");
const router = express.Router();
const controller = require("../controllers/post");

router.get("/", controller.get_posts);

router.get("/:postId", controller.get_post);

module.exports = router;
