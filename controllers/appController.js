const mongoose = require('mongoose');

const Request = mongoose.model('Request');
const Job = mongoose.model('Job');
const promisify = require('es6-promisify'); // eslint-disable-line no-unused-vars
const mail = require('../handlers/mail');
const pug = require('pug');
// Controller to get Home page
exports.getHomepage = (req, res) => {
  res.render('index', { title: 'Find and Hire the Best Lawyers in Nigeria' });
};

// Controller to get About page
exports.getAbout = (req, res) => {
  res.render('about', { title: 'About Us' });
};

// Controller to get Contact page
exports.getContact = (req, res) => {
  res.render('contact', { title: 'Contact Us' });
};

// Controller to get Agreement page
exports.getDiy = (req, res) => {
  res.render('agreements', { title: 'DIY Agreements' });
};

// Controller to get Appointment page
exports.getAppointment = (req, res) => {
  res.render('appointment', { title: 'Make an Appointment' });
};

// Controller to get Call Back Page
exports.getCallBack = (req, res) => {
  res.render('callBack', { title: 'Request a Call Back' });
};

// Controller to get Terms Page
exports.getTerms = (req, res) => {
  res.render('terms', { title: 'Terms and Conditions' });
};

// Controller to get Policy Page
exports.getPolicy = (req, res) => {
  res.render('policy', { title: 'Privacy Policy' });
};

// Controller to get FAQ Page
exports.getFaq = (req, res) => {
  res.render('faq', { title: 'FAQ' });
};

// Controller to get Disclaimer Page
exports.getDisclaimer = (req, res) => {
  res.render('disclaimer', { title: 'Disclaimer' });
};

// Middleware to verify Contact Us Input
exports.verifyContactUs = (req, res, next) => {
  req.checkBody('name', 'Name field cannot be empty').notEmpty();
  req.checkBody('email', 'That Email is not valid').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false,
  });
  req.checkBody('phone', 'Phone cannot be Blank!').notEmpty();
  req.checkBody('message', 'Legal Request cannot be Blank!').notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    const { name } = req.body;
    const { email } = req.body;
    const { phone } = req.body;
    const { message } = req.body;
    req.flash('danger', errors.map(err => err.msg));
    res.render('contact', {
      title: 'Contact Us',
      name,
      phone,
      message,
      email,
      flashes: req.flash(),
    });
    // STop fn from running
    return;
  }
  next();
};

// Contact Us Controller
exports.contactUs = (req, res) => {
  const data = `Name: ${req.body.name} <br>
  Email: ${req.body.email} <br>
  Phone: ${req.body.phone} <br>
  Message: ${req.body.message}`;
  mail.send({
    user: process.env.CONTACT_MAIL,
    subject: 'Contact Message',
    data,
  });
  req.flash('success', 'Message Submitted. We will contact you shortly');
  res.redirect('back');
};

/* Controller to get engage a Lawyer page
We Match the User to a Valid Lawyer who can handle your legal issues
*/
exports.engageLawyer = (req, res) => {
  res.render('engageLawyer', { title: 'Engage a Lawyer' });
};

/* Controller to get get Legal Advice */
exports.legalAdvice = (req, res) => {
  res.render('legalAdvice', { title: 'Legal Advice' });
};

// MIDDLEWARE TO VERIFY SUBMITTED DATA
exports.verifyRequest = (req, res, next) => {
  req.checkBody('name', 'Name field cannot be empty').notEmpty();
  req.checkBody('email', 'That Email is not valid').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false,
  });
  req.checkBody('phone', 'Phone cannot be Blank!').notEmpty();
  req.checkBody('message', 'Legal Request cannot be Blank!').notEmpty();
  req.checkBody('contactMethod', 'Please select a Contact Method!').notEmpty();
  req.checkBody('legalService', 'Please select a Legal Service!').notEmpty();
  req.checkBody('location', 'Please select a Location!').notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    const { phone } = req.body;
    const { message } = req.body;
    req.flash('danger', errors.map(err => err.msg));
    res.render('engageLawyer', {
      title: 'Engage a Lawyer',
      phone,
      message,
      flashes: req.flash(),
    });
    // STop fn from running
    return;
  }
  next();
};

// CONTROLLER TO SEND ENGAGE LAWYER AND REQUEST FOR ADVICE
exports.requestLawyer = async (req, res) => {
  req.body.author = req.user._id;
  await (new Request(req.body)).save();
  //  SEND MAIL TO THE USER WITH THE REQUEST HERE
  pug.renderFile('./views/email/requestMail.pug', {
    mail: req.body.email,
    subject: 'Lawyerup Request',
    message: req.body.message,
    contactMethod: req.body.contactMethod,
    legalService: req.body.legalService,
    location: req.body.location,
    phone: req.body.phone,
  }, (err, data) => {
    if (err) {
      req.flash('success', 'Message Submitted. We will contact you shortly');
      res.redirect('back');
    } else {
      mail.send({
        user: req.body.email,
        subject: 'Lawyerup Request',
        data,
      });
      req.flash('success', 'Message Submitted. We will contact you shortly');
      res.redirect('back');
    }
  });
};

// Controller to get careers page
exports.careers = async (req, res) => {
  const jobs = await Job.find();
  res.render('career', { title: 'Careers', jobs });
};
