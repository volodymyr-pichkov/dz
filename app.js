const express = require("express");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");

dotenv.config();
require("./config/passport");

const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protected");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: process.env.SESSION_SECRET || "default_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
