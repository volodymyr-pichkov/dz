const express = require("express");
const router = express.Router();

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized" });
}

router.get("/", isAuthenticated, (req, res) => {
  res.json({ message: "Welcome to protected route", user: req.user });
});

module.exports = router;
