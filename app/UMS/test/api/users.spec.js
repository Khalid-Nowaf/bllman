var should = require('chai').should() 
var request = require('supertest')('http://localhost:3000');
var User = require('../../models/User');

 
describe('Users API', function() {
 var userToken;
 var user = {email:'test@test.com',password:'123123',phone:'0555555555'}

    before('Create new users before tests',function(done) { // create new user before the test 
    request
    .post('/auth/signup')
    .send(user)
    .set('Accept','application/json')
    .expect(200)
    .end((err,res)=>{
        if(err) throw err;
        // signin to get the auth token
        request
        .post('/auth/signin')
        .send(user)
        .set('Accept','application/json')
        //.set('Authorization',userToken)
        .expect(200)
        .end((err, res) => {
         userToken = 'JWT '+res.body.token 
         done();  
        });
    });
  });

  // after all test delete the dummy user
  after("After all test delete the dummy user",(done) => {
      User.remove({email:user.email},(err,duser)=>{
          should.not.exist(err);
          should.exist(duser);
          done();
      });
  });

  after(function() {
    // runs after all tests in this block
  });
    describe('Users Profile', function() {
        it('should not allows an unauthorized user', function(done) {
            request
            .get('/users/profile') 
            .expect(401,done) 
        });
         it('should  allows an unauthorized user', function(done) {
            request
            .get('/users/profile') 
            .set('Authorization',userToken)
            .expect(200,done) 
        });
     });
     
  describe('Users Billing info', function() {
        it('should not allows an unauthorized user', function(done) {
            request
            .get('/users/profile') 
            .expect(401,done) 
        });
        it('should allows an unauthorized user', function(done) {
            request
            .get('/users/profile') 
            .set('Authorization',userToken)     
            .expect(200,done) 
        });
     });
});
