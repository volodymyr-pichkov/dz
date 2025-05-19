const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();

const { users } = require("../config/passport");

router.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const newUser = { id: Date.now(), email, passwordHash };
  users.push(newUser);

  res.json({ message: "Registered successfully" });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });

    req.logIn(user, err => {
      if (err) return next(err);
      res.json({ message: "Logged in successfully" });
    });
  })(req, res, next);
});

router.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.json({ message: "Logged out" });
  });
});

module.exports = router;
