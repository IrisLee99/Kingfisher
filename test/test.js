
var chai = require('chai')
, chaiHttp = require('chai-http');
chai.use(chaiHttp);
var assert = chai.assert;    // Using Assert style
var expect = chai.expect;    // Using Expect style
var should = chai.should();  // Using Should style

var assert = require('assert');

describe('Browser and Node.js', function () {

    var isNode = typeof process === 'object';
    var isBrowser = typeof window === 'object';
    var request = chai.request;


    it('is present on chai', function () {
      expect(chai).to.respondTo('request');
    });

    it('can request a web page', function (done) {
        request('https://openweathermap.org')
          .get('/api')
          .end(function (err, res) {
            res.should.have.status(200);
            res.should.be.html;
            res.should.not.be.text;
            res.should.not.be.json;
            res.text.should.be.a('string').with.length.above(0);
  
            // Slightly different behavior in SuperAgent in Node/browsers
            isNode && res.body.should.deep.equal({});
            isBrowser && expect(res.body).to.be.null;
  
            done(err);
          });
      });

    it('can request JSON data', function (done) {
        request('https://openweathermap.org/api')
          .get('/get')
          .end(function (err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.should.not.be.html;
            res.should.not.be.text;
            res.text.should.be.a('string').with.length.above(0);
            res.body.should.be.an('object');
            done(err);
          });
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

