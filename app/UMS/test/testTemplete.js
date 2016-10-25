var should = require('chai').should();
var request = require('supertest')('http://localhost:3000');


describe('The tested thing  ', function() {
  it('1 shoud be ...', function(done) {
    request
      .get('/') // the route 
      .expect(200,done) // what to is expexted ?
      //.expect(..,..)
      //.expect(..,..)
      
  });
});
