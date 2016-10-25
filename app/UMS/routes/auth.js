var express = require('express');
var router = express.Router();
let passport = require('passport');
let jwt = require('jsonwebtoken');
var User = require('../models/User');
let config = require('../config');
var veri_code = require('../services/veri-code');

/* Auth routes. */

// Register new users
router.post('/signup', function(req, res) {
  if (!req.body.email || !req.body.password) {
    res.json({
      success: false,
      message: 'Please enter email and password.'
    });
  } else {
    let newUser = new User({
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone
    });

    // Attempt to save the user
    newUser.save(function(err,user) {
      if (err) {
        return res.json({
          success: false,
          message: 'That email address already exists.',
          error: err
        });
      }
      // after create new use generate verification code TODO: send SMS
      veri_code.getCode(user.phone,function(){
        res.json({
        success: true,
        message: 'Successfully created new user.'
        });
      });
    });
  }
});

// verification route that verified an account
router.post('/veri', function(req, res) {
   if (!req.body.phone || !req.body.code) {
    res.json({
      success: false,
      message: 'missing phone number or code .'
    });
  } else {
    User.findOne({phone:req.body.phone},function(err,user){
      if( err) throw err;

      if (!user){
        res.send({
        success: false,
        message: 'Phone number is not valid'
      });
      } else {
        // check if code is match
        if(req.body.code == user.code){
          user.veri = true
          user.save(function(err,user){
             res.send({
             success: true,
             message: 'account has been verified'
           });
          });
        // if the code does not match  
        } else {
          res.send({
             success: false,
             message: 'the code does not match'
           });
        }
      }
    });
  }
});

// Authenticate the user and get a JSON Web Token to include in the header of future requests.
router.post('/signin', function(req, res) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.send({
        success: false,
        message: 'Authentication failed. User not found.'
      });
    } else {
      // Check if password matches
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (isMatch && !err) {
          // Create token if the password matched and no error was thrown
          var token = jwt.sign(user, config.auth.secret, {
            expiresIn: "2 days"
          });
          res.json({
            success: true,
            message: 'Authentication successfull',
            token
          });
        } else {
          res.send({
            success: false,
            message: 'Authentication failed. Passwords did not match.'
          });
        }
      });
    }
  });
});

// reset password using code
router.post('/reset',(req, res) => {
 if(!req.body.email || !req.body.password || !req.body.code  ){ // TODO: handle each case
    res.send({
       success: false,
       message: 'missing Email Address or new password ...'
    });
 } else {
   User.findOne({email:req.body.email},(err,user)=>{
     if(err) throw err;
     if(!user){
        res.send({
            success: false,
            message: 'Email address not found'
          });
     } else {
       if(user.code == req.body.code){
         user.password = req.body.password;
         user.save(function(err,user){
           res.send({
            success: true,
            message: 'the password has been reseted for '+ user.email
           });
         });
       } else {
          res.send({
            success: false,
            message: 'The code is uncorecct, please try agian'
          });
       }
     }
  });
 }
});
// sent reset password code  using SMS 
router.post('/reset/email',(req, res) => {

  if(!req.body.email){
    res.send({
       success: false,
       message: 'missing Email Address ...'
    });
  } else {
      User.findOne({email:req.body.email},(err, user) => {
        if(err) throw err;
        if(!user){
          res.send({
            success: false,
            message: 'Email address not found'
          });
        } else {
          veri_code.getCode(user.phone,()=>{
            res.send({
            success: true,
            message: 'Code had been sent to phone number ' + user.phone
          });
          })
        }
      });
  }
});

module.exports = router;
