const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
      done(null, user);
    });
});

passport.use(
  new GoogleStrategy(
  {
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id}).then((existingUser) => {
      if (existingUser) {
        // We already have a record with the given profile Id
        done(null, existingUser);
      } else {
        // We do not have a user id with this profile, make new Id
        new User({ googleId: profile.id })
          .save()
          .then(user => done(null, user));
      }
    });
  })
);