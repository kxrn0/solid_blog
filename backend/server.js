const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const postRouter = require("./routes/post");

app.use(cors());
app.use(express.json());

app.use("/api/posts", postRouter);

mongoose
  .connect(process.env.DB)
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Listening on ${process.env.PORT}`)
    );
  })
  .catch((error) => console.log(error));
