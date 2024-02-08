const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Owner = require("../models/owner");

exports.log_in = async (req, res) => {
  const name = req.body.name?.trim();
  const password = req.body.password?.trim();

  if (!name || !password) return res.status(400).json({ message: "Fuck!" });

  try {
    const owner = await Owner.findOne({ name });

    if (!owner) return res.status(400).json({ message: "Fuck!" });

    const matches = await bcrypt.compare(owner.password, password);

    if (!matches) return res.status(400).json({ messsage: "Fuck!" });

    jwt.sign(
      { ownerId: owner._id },
      process.env.SECRET,
      { expiresIn: "30d" },
      (error, token) => {
        if (error) return res.status(500).json({ message: "Fuck!" });

        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Fuck!" });
  }
};

exports.check_token = (req, res) =>
  res.json({ message: "true", newToken: req.newToken });
