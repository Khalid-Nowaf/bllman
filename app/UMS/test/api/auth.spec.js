var should = require('chai').should();
var request = require('supertest')('http://localhost:3000');
var User = require('../../models/User');

describe('Auth API', function() {
    var newuser = {email:'authuser@test.com',password:'123123',phone:'123123'};
    var userToken;
    var userCode;
    // after all test delete the dummy user
  after("After all test delete the dummy user",(done) => {
      User.remove({email:newuser.email}, (err,duser) => {
          should.not.exist(err);
          should.exist(duser);
          done();
      });
  });

  describe('Sign Up', (done) =>{
     it('should create new account for new user', function(done) {
      request
      .post('/auth/signup')
      .send(newuser)
      .set('Accept','application/json')
      .expect(200)
      .end((err, res) => {
        User.findOne({email:newuser.email}, (err, user) => {
          should.not.exist(err);
          should.exist(user);
          userCode = user.code; // SMS-CODE init, will be used to verify the user.

          done();
        });
      });
     });
  });

  describe('Sing In', (done) => {
    it('should log in the user and return a JWT token', (done) => {
      request
        .post('/auth/signin')
        .send(newuser)
        .set('Accept','application/json')
        .expect(200)
        .end((err, res) => {
         should.not.exist(err);
         should.exist(res.body.token); 
         userToken = 'JWT '+res.body.token // save the token for next tests 
         done();  
      });
    });
    it('the JWT token should be valid', (done) => {
      request
        .get('/users/profile') 
        .set('Authorization',userToken)
        .expect(200,done) 
    });
  });

  describe('Reset Account Password', (done) => {
    it('The user should get a new SMS-CODE for reset', (done) => {
      request
        .post('/auth/reset/email')
        .send(newuser)
        .set('Accept','application/json')
        .expect(200)
        .end((err, res) => {
          should.not.exist(err);
          User.findOne({email:newuser.email}, (err, user) => {
            should.not.exist(err);
            should.exist(user);
            user.code.should.not.equal(userCode); // so the system create new one.
            userCode = user.code; // update the code
            done();
          });
        });
    });

    it('the user should change the password using the SMS-CODE', (done) => {
      request
        .post('/auth/reset')
        .send({email:newuser.email,password:"newpassword",phone:newuser.phone,code:userCode})
        .set('Accept','application/json')
        .expect(200)
        .end((err, res) =>{
          should.not.exist(err);
          res.body.success.should.be.ok;
          done();
        });
        })
    });
  });

