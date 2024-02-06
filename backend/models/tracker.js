const mongoose = require("mongoose");
const trackerSchema = mongoose.Schema({
  number: { type: Number, default: 0 },
});

module.exports = mongoose.model("Tracker", trackerSchema);
