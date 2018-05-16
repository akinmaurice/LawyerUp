const chai = require('chai');
const mocha = require('mocha');
const chaiHttp = require('chai-http');

// Import the App Server
const server = require('../../start');

chai.use(chaiHttp);

const should = chai.should();


describe('Integration Tests', () => {
  before(() => {
  });

  after(() => {
  });

  // Test for Index Route
  it('It should return the index page', (done) => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

