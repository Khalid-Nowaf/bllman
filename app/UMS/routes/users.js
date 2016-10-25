var express = require('express');
var router = express.Router();
let passport = require('passport');

// router.get('/', function(req, res) {
//   User.find({}, function(err, users) {
//     res.json(users);
//   });
// });


// profile route with JWT
router.get('/profile', passport.authenticate('jwt', {
  session: false
}), function(req, res) {
  res.send('It worked! User id is: ' + req.user._id + '.');
});

// billing route with JWT
router.get('/billing', passport.authenticate('jwt', {
  session: false
}), function(req, res) {
  res.send('It worked! User id is: ' + req.user._id + '.');
});


module.exports = router;
