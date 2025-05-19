const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const users = [
  { id: 1, email: "test@example.com", passwordHash: bcrypt.hashSync("123456", 10) }
];

passport.use(new LocalStrategy({ usernameField: "email" },
  (email, password, done) => {
    const user = users.find(u => u.email === email);
    if (!user) return done(null, false, { message: "User not found" });

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) return done(null, false, { message: "Invalid password" });

    return done(null, user);
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find(u => u.id === id);
  done(null, user);
});

module.exports = { users };
