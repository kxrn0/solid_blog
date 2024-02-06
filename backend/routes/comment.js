const express = require("express");
const router = express.Router();
const controller = require("../controllers/comment");

router.get("/:commentId", controller.get_comment);

module.exports = router;
