const Owner = require("../models/owner");
const bcrypt = require("bcrypt");

module.exports = async function create_owner() {
  const existing = await Owner.findOne();

  if (existing) return;

  const name = process.env.NAME || "alhazred";
  const password = process.env.PASSWORD || "password";
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const owner = new Owner({ name, password: hash });

  await owner.save();
};
