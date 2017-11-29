const mongoose = require('mongoose');

const User = mongoose.model('User');
const promisify = require('es6-promisify');
const mail = require('../handlers/mail');
const pug = require('pug');
const crypto = require('crypto');

// Controller to get login page
exports.getLogin = (req, res) => {
  res.render('login', { title: 'Sign In' });
};


// Controller to get register page
exports.getRegister = (req, res) => {
  res.render('register', { title: 'Create an Account' });
};

// MiddleWare to validate user data submitted to register
exports.validateRegister = (req, res, next) => {
  req.checkBody('name', 'Name field cannot be empty').notEmpty();
  req.checkBody('email', 'That Email is not valid').isEmail().notEmpty();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false,
  });
  req.checkBody('password', 'Password cannot be Blank!').notEmpty();
  req.checkBody('password-confirm', 'COnfirm Password cannot be empty!').notEmpty();
  req.checkBody('password-confirm', 'Your Passwords do not match').equals(req.body.password);
  const errors = req.validationErrors();
  if (errors) {
    const name = req.body.name;
    const email = req.body.email;
    req.flash('danger', errors.map(err => err.msg));
    res.render('register', {
      title: 'Create an Account',
      name,
      email,
      flashes: req.flash(),
    });
    // STop fn from running
    return;
  }
  next();
};

// Middleware to check if user exists already
exports.checkUserExists = async (req, res, next) => {
  const user = await User.find({ email: req.body.email });
  if (user.length) {
    console.log('User Exists');
    // STop fn from running
    req.flash('danger', 'A user with that email Exists Already');
    res.render('register', { title: 'Create an Account', body: req.body, flashes: req.flash() });
    return;
  }
  next();
};

// Middle ware Controller to regsiter user
exports.registerUser = async (req, res) => {
  // GENERATE TOKEN AND SET TIME TO Activate Account
  req.body.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  // SET TIME EXPIRES AS ONE HOUR FROM NOW
  req.body.resetPasswordExpires = Date.now() + 3600000;
  const user = new User({
    email: req.body.email,
    name: req.body.name,
    resetPasswordExpires: req.body.resetPasswordExpires,
    resetPasswordToken: req.body.resetPasswordToken,
  });
  const registerWithPromise = promisify(User.register, User);
  await registerWithPromise(user, req.body.password);
  const activationLink = `http://${req.headers.host}/user/activate/${user.resetPasswordToken}`;
  pug.renderFile('./views/email/registerMail.pug', { mail: req.body.email, activationLink }, (err, data) => {
    if (err) {
      req.flash('success', 'Account Successfully created. Please activate your account using the link sent to your mail');
      res.redirect('/login');
    } else {
      mail.send({
        user: req.body.email,
        subject: 'Complete Account Resgistration',
        data,
      });
      req.flash('success', 'Account Successfully created. Please activate your account using the link sent to your mail');
      res.redirect('/login');
    }
  });
};

// ACTIVATE USER ACCOUNT
exports.activate = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    req.flash('danger', 'Activation Token Invalid or has expired! Kindly reset your password to confirm');
    res.redirect('/login');
  } else {
    const updates = {
      status: true,
    };
    await User.findOneAndUpdate({ _id: user._id }, { $set: updates }, { new: true, runValidators: true, context: 'query' });
    req.flash('success', 'Account Activated!');
    res.redirect('/login');
  }
};

// GET USER EDIT ACCOUNT PAGE
exports.editAccount = (req, res) => {
  res.render('editUser', { title: 'Edit My Account' });
};

// Controller to update user account
exports.updateAccount = async (req, res) => {
  const updates = {
    name: req.body.name,
  };
  await User.findOneAndUpdate({ _id: req.user._id }, { $set: updates }, { new: true, runValidators: true, context: 'query' });
  req.flash('success', 'Updated Profile!');
  res.redirect('back');
};
