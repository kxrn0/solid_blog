const express = require("express");
const router = express.Router();
const controller = require("../controllers/owner");
const check_signature = require("../middleware/check_signature");

router.post("/log_in", controller.log_in);

router.get("/log_in/verify", check_signature, controller.check_token);

module.exports = router;
