const mongoose = require('mongoose');
const Appointment = mongoose.model('Appointment');
const promisify = require('es6-promisify');
const mail = require('../handlers/mail');
const pug = require('pug');

//MIDDLEWARE TO VALIDATE USER INPUT  for CONTACT LAWYER
exports.validateInput = (req, res, next) => {
    req.checkBody('name', 'Name field cannot be empty').notEmpty();
    req.checkBody('email', 'That Email is not valid').isEmail().notEmpty();
    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    });
    req.checkBody('phone', 'Phone cannot be Blank!').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        req.flash('danger', errors.map(err => err.msg));
        res.redirect(`/contact-lawyer/${req.params.slug}`);
        //STop fn from running
        return;
    }
    next();
}

//controller to contact lawyer
exports.createAppointment = async (req, res) => {
    req.body.author = req.user._id;
    const appointment = await (new Appointment(req.body)).save();
    req.flash('success', 'A message has been Sent. we will contact you shortly');
    res.redirect(`/attorney/${req.params.slug}`);
}