var should = require('chai').should();
var request = require('supertest')('http://localhost:3000');


describe('Home Page', function() {
  it('the root page should be accessible for every one ', function(done) {
    request
      .get('/')
      .expect(200,done) 
  });
});
