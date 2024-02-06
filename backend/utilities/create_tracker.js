const Tracker = require("../models/tracker");

module.exports = async function create_tracker() {
  const existing = await Tracker.findOne();

  if (existing) return;

  const tracker = new Tracker();

  await tracker.save();
};
