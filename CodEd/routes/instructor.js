var express = require('express');
var router = express.Router();
var User = require('./users')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('instructor',{username: req.session.username});
});

module.exports = router;