var should = require('chai').should();
var request = require('supertest')('http://localhost:3000');
var User = require('../../models/User');


describe('User Verification', function() {
    var userToken;
    var userCode;
    var user = {email:'test3@test.com',password:'123123',phone:'066666666'}

  // after all test delete the dummy user
  after("After all test delete the dummy user",(done) => {
      User.remove({email:user.email},(err,duser)=>{
          should.not.exist(err);
          should.exist(duser);
          done();
      });
  });

 describe("verify user Via SMS-CODE", (done) => {
     it("the user shoud get SMS-CODE after sign up", (done) => {
          request
            .post('/auth/signup')
            .send(user)
            .set('Accept','application/json')
            .expect(200)
            .end((err, res) => {
                should.not.exist(err);
                User.findOne({email:user.email}, (err, user) => {
                    should.not.exist(err);
                    should.exist(user);
                    should.exist(user.code);
                    userCode = user.code;
                    done();
                });
            });
        });

    it("the user should not be verified after useing the wrong SMS-CODE", (done) => {
        request
        .post('/auth/veri')
        .send({phone:user.phone,code:00000})
        .set('Accept','application/json')
        .expect(200)
        .end((err, res) => {
            should.not.exist(err);
            User.findOne({email:user.email}, (err, user) => {
                should.not.exist(err);
                should.exist(user);
                user.veri.should.not.be.ok; // not ok == false
                done();
            });
        })
    });

    it("the user should be verified after useing the the right SMS-CODE", (done) => {
        request
        .post('/auth/veri')
        .send({phone:user.phone,code:userCode})
        .set('Accept','application/json')
        .expect(200)
        .end((err, res) => {
            should.not.exist(err);
            User.findOne({email:user.email}, (err, user) => {
                should.not.exist(err);
                should.exist(user);
                user.veri.should.be.ok; // ok == true
                done();
            });
        })
    });
 });

});
