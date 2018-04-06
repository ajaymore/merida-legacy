var express = require('express');
var router = express.Router();
var passport = require('passport');

// Web login form
router.get('/web-login', function(req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/');
  }
  res.render('login');
});

// Web login authentication using username, password
router.post(
  '/web-login',
  passport.authenticate('local', {
    failureRedirect:
      process.env.ENVIRONMENT === 'production'
        ? '/auth/web-login'
        : 'http://localhost:3000/login.html'
  }),
  function(req, res) {
    res.redirect(
      process.env.ENVIRONMENT === 'production' ? '/' : 'http://localhost:3000/'
    );
  }
);

// Web logout
router.get('/web-logout', function(req, res) {
  req.logout();
  res.render('login');
});

// Get profile of logged in user
router.get('/user-profile', function(req, res) {
  if (req.isAuthenticated()) {
    res.status(200).json({ user: req.user });
  }
  res.status(401).json({ message: 'User not logged in' });
});

// Username, password based login from user mobile
router.post(
  '/mobile-login',
  passport.authenticate('local', {
    session: false,
    failWithError: true
  }),
  async function(req, res, next) {
    try {
      res.status(200).json({
        user: {
          ...req.user,
          token: jwt.sign(req.user, process.env.JWT_AUTH_SECRET)
        }
      });
    } catch (err) {
      res.status(400).send({ message: 'Login failure' });
    }
  }
);

// web google auth
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

// google auth redirect
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/web-login' }),
  function(req, res) {
    res.redirect('/');
  }
);

// mobile google auth
router.post('/mobile-google', async function(req, res, next) {
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(
    process.env.GOOGLE_CLIENT_SERVER_ID,
    process.env.GOOGLE_CLIENT_SERVER_SECRET,
    'urn:ietf:wg:oauth:2.0:oob'
  );
  oauth2Client.verifyIdToken(
    req.token,
    process.env.GOOGLE_CLIENT_MOBILE_ID,
    function(e, login) {
      var payload = login.getPayload();
      console.log(payload);
      res.status(200).send(payload);
    }
  );
});

// admin should be able to revoke Refreshtoken, block user
// password change should invalidate Refreshtoken
// jwt should expire every 24 hours and new one should be fetched via Refreshtoken
// a device identifier must be used to store Refreshtoken in user document

module.exports = router;
