require("dotenv").config();

const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const ownerRouter = require("./routes/owner");
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comment");
const create_owner = require("./utilities/create_owner");
const create_tracker = require("./utilities/create_tracker");
const http = require("http");

app.use(cors());
app.use(express.json());

app.use("/api/auth", ownerRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);

mongoose
  .connect(process.env.DB)
  .then(async () => {
    try {
      await Promise.all([create_owner(), create_tracker()]);

      app.listen(process.env.PORT, () =>
        console.log(`Listening on ${process.env.PORT}`)
      );
    } catch (error) {
      console.log(error);

      const errorSerber = http.createServer((req, res) => {
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/plain");
        res.end("Application failed to initialize");
      });

      errorSerber.listen(process.env.PORT, () =>
        console.log("Application failed to initialize. Serving error message")
      );
    }
  })
  .catch((error) => console.log(error));
