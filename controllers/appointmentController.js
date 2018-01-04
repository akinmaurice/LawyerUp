const mongoose = require('mongoose');

const Appointment = mongoose.model('Appointment');
const promisify = require('es6-promisify'); // eslint-disable-line no-unused-vars
const mail = require('../handlers/mail');
const pug = require('pug');

// MIDDLEWARE TO VALIDATE USER INPUT  for CONTACT LAWYER
exports.validateInput = (req, res, next) => {
  req.checkBody('name', 'Name field cannot be empty').notEmpty();
  req.checkBody('email', 'That Email is not valid').isEmail().notEmpty();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false,
  });
  req.checkBody('phone', 'Phone cannot be Blank!').notEmpty();
  req.checkBody('legalService', 'You must select a Legal Service!').notEmpty();
  req.checkBody('message', 'Details of request cannot be empty!').notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    req.flash('danger', errors.map(err => err.msg));
    res.redirect(`/contact-lawyer/${req.params.slug}`);
    // STop fn from running
    return;
  }
  next();
};

// controller to contact lawyer
exports.createAppointment = async (req, res) => {
  req.body.author = req.user._id;
  await (new Appointment(req.body)).save();
  // SEND MAIL TO THE USER WITH THE REQUEST HERE
  pug.renderFile('./views/email/lawyerContact.pug', {
    // Lawyer EMail Address
    lawyerName: req.body.lawyerName,
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
    legalService: req.body.legalService,
    phone: req.body.phone,
  }, (err, data) => {
    if (err) {
      console.log(err);
      req.flash('success', 'Message Submitted. We will contact you shortly');
      res.redirect('back');
    } else {
      mail.send({
        user: req.body.email,
        subject: 'Lawyerup Request',
        data,
      });
      req.flash('success', 'A message has been Sent. we will contact you shortly');
      res.redirect(`/attorney/${req.params.slug}`);
    }
  });
};

// Middleware to verify Request Call Back Request
exports.verifyRequestCallBack = (req, res, next) => {
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
    res.render('callBack', {
      title: 'Request a CallBack',
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
exports.requestCallBack = (req, res) => {
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
