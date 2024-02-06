const express = require("express");
const router = express.Router();
const controller = require("../controllers/owner");

router.post("/log_in", controller.log_in);
