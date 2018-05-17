const chai = require('chai');
const mocha = require('mocha');
const chaiHttp = require('chai-http');

// Import the App Server
const server = require('../../start');

chai.use(chaiHttp);

const should = chai.should();


describe('User Action Integration Tests', () => {
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

  // Get Lawyers Directory
  it('It should return all laywers', (done) => {
    chai.request(server)
      .get('/directory')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  // Get Lawyers by Tags ROute
  it('It should return laywers by tag Immigration', (done) => {
    chai.request(server)
      .get('/tags/Immigration')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  // Search Lawyers by Area and location
  it('It should Search laywers by Area of specialization and Location', (done) => {
    chai.request(server)
      .post('/search')
      .send({ location: 'Lagos', tag: 'Immigration' })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

