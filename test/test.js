var chai = require('chai');  
var assert = chai.assert;    // Using Assert style
var expect = chai.expect;    // Using Expect style
var should = chai.should();  // Using Should style

var assert = require('assert');

describe('Browser and Node.js', function () {
    it('is present on chai', function () {
      expect(chai).to.respondTo('request');
    });
});

/*describe('/GET index', () => {
    it('it should GET index home page', (done) => {
      chai.request(server)
          .get('/index')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
            done();
          });
    });
});*/

