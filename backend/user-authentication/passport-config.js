const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const UserAccount = require('../models/user-account');

passport.use(
  new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
    try {
      const user = await UserAccount.findOne({ email });
      const match = await bcrypt.compare(password, user.password);

      if (!user) {
        return done(null, false, { message: 'incorrect email' });
      }
      if (!match) {
        return done(null, false, { message: 'incorrect password' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserAccount.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
