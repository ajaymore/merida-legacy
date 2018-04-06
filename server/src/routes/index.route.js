var express = require('express');
var router = express.Router();
var { ensureAuthenticated } = require('../utils');

router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('index', { user: req.user });
});

module.exports = router;
