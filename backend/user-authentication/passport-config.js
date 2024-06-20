const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const UserAccount = require('../models/user-account');

passport.use(
  new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
    try {
      const user = await UserAccount.findOne({ email });

      if (!user) {
        return done(null, false, { message: 'Account does not exist or incorrect email' });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return done(null, false, { message: 'Incorrect password' });
      }
      user.online = true;
      await user.save();
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
