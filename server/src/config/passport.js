var passport = require('passport');
var LocalStrategy = require('passport-local');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/user.model');

passport.use(
  'local',
  new LocalStrategy(
    {
      usernameField: 'email',
      session: false,
      passReqToCallback: true
    },
    async function(req, email, password, done) {
      try {
        const user = await User.findOne({ email: email }).populate('roles');
        if (user) {
          if (!User.validPassword(user, password)) {
            done(null, false, { message: 'Invalid credentials.' });
          }
          done(null, {
            id: user._id,
            email: user.email,
            groups: user.groups,
            name: user.name,
            blocked: user.blocked
          });
        } else {
          done(null, false, { message: 'User not found.' });
        }
      } catch (err) {
        done(null, false, { message: 'Request error.' });
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback'
    },
    async function(accessToken, refreshToken, profile, done) {
      try {
        const user = await User.findOne({ email: profile.emails[0].value })
          .select('-password')
          .populate('roles');
        if (user) {
          done(null, user);
        } else {
          let newUser = new User();
          newUser.email = profile.emails[0].value;
          newUser.name = profile.displayName;
          newUser.blocked = false;
          newUser.groups = [];
          const savedUser = await newUser.save();
          done(null, savedUser);
        }
      } catch (err) {
        done(null, false, { message: 'Request error.' });
      }
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id)
      .select('-password')
      .populate('groups', 'id name');
    if (!user) {
      done(null);
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
});
