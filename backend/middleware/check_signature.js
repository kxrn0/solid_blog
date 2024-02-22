const Owner = require("../models/owner");
const jwt = require("jsonwebtoken");

function check_expiry(exp, id, req, res) {
  const today = Date.now();
  const week = 7 * 24 * 60 * 60 * 1000;
  const diff = exp - today;

  if (diff > 0 && diff < week)
    jwt.sign(
      { ownerId: id },
      process.env.SECRET,
      {
        expiresIn: "30d",
      },
      (error, token) => {
        if (error) return res.status(500).json({ message: "Fuck!" });

        req.newToken = token;
      }
    );
}

module.exports = function check_signature(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth) return next();

  const token = auth.split(" ")[1];

  jwt.verify(token, process.env.SECRET, async (error, payload) => {
    if (error) return res.status(500).json({ message: "Fuck!" });

    const owner = await Owner.findById(payload.ownerId);

    if (!owner) return res.status(401).json({ message: "Fuck!" });

    check_expiry(payload.exp, owner._id, req, res);

    next();
  });
};
