const chai = require('chai');
const mocha = require('mocha');
const chaiHttp = require('chai-http');

// Import the App Server
const server = require('../../start');

chai.use(chaiHttp);

const should = chai.should();


describe('Laywer Integration Tests', () => {
  before(() => {
  });

  after(() => {
  });

  // Get About Page
  it('It should return the Join Us Page for Lawyers', (done) => {
    chai.request(server)
      .get('/join-us')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

