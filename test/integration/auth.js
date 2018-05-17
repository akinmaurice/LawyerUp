const chai = require('chai');
const mocha = require('mocha');
const chaiHttp = require('chai-http');

// Import the App Server
const server = require('../../start');

chai.use(chaiHttp);

const should = chai.should();


describe('Auth Integration Tests', () => {
  before(() => {
  });

  after(() => {
  });

  // Get About Page
  it('It should return the Login Page', (done) => {
    chai.request(server)
      .get('/login')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  // Get Lawyers Page
  it('It should return a lawyers Page', (done) => {
    chai.request(server)
      .get('/attorney/akintayo-akinyemi')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  // Get Contact Lawyer Page
  it('It should return Page to contact a Lawyer', (done) => {
    chai.request(server)
      .get('/contact-lawyer/akintayo-akinyemi')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  // Get Contact Lawyer Page
  it('It should contact a Lawyer', (done) => {
    const message = {
      name: 'Akintayo Akinyemi',
      email: 'akinmaurice@gmail.com',
      phoneNumber: '08166598325',
      legalService: 'Corporate Law',
      message: 'Hello i need your help to retrive hjhbghjg',
    };
    chai.request(server)
      .post('/contact-lawyer/akintayo-akinyemi')
      .send(message)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  // Get Edit Password Page
  it('It should return Page to Edit Users Password', (done) => {
    chai.request(server)
      .get('/user/edit-password')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  // Get Edit Profile Page
  it('It should return Page to Edit Users Profile', (done) => {
    chai.request(server)
      .get('/user/edit-profile')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  // Get Contact Us Page
  it('It should return the Sign up Page', (done) => {
    chai.request(server)
      .get('/register')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  // Get Reset Password Page
  it('It should return the Forgot Password Page', (done) => {
    chai.request(server)
      .get('/forgot')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

