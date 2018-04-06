exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('authenticated...');
    return next();
  }
  res.redirect('/auth/web-login');
};
