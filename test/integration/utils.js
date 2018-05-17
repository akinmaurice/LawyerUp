const chai = require('chai');
const mocha = require('mocha');
const chaiHttp = require('chai-http');

// Import the App Server
const server = require('../../start');

chai.use(chaiHttp);

const should = chai.should();


describe('Utils and Support Pages Integration Tests', () => {
  before(() => {
  });

  after(() => {
  });

  // Get About Page
  it('It should return the About Page', (done) => {
    chai.request(server)
      .get('/about')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  // Get Contact Us Page
  it('It should return the Contact us Page', (done) => {
    chai.request(server)
      .get('/contact')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  // Get Careers Page
  it('It should return the Careers Page', (done) => {
    chai.request(server)
      .get('/career')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  // Get Terms Page
  it('It should return the Terms and Conditions Page', (done) => {
    chai.request(server)
      .get('/terms')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  // Get Policy Page
  it('It should return the Policy Page', (done) => {
    chai.request(server)
      .get('/policy')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  // Get Disclaimer Page
  it('It should return the Disclaimer Page', (done) => {
    chai.request(server)
      .get('/disclaimer')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  // Get FAQ Page
  it('It should return the FAQ Page', (done) => {
    chai.request(server)
      .get('/faq')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  // Get Call Request Call Page
  it('It should return the Request CallBack Page', (done) => {
    chai.request(server)
      .get('/call-request')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  // Request CallBack Page send Post
  it('It should send a Request for CallBack', (done) => {
    const request = {
      name: 'Akintayo Akinyemi',
      email: 'akintayoy@gmail.com',
      phoneNumber: '08166598325',
      message: 'Legal Service required iskjnfhjfhjf',
    };
    chai.request(server)
      .post('/call-request')
      .send(request)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

