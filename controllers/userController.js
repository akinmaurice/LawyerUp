const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const mail = require('../handlers/mail');
const pug = require('pug');

//Controller to get login page
exports.getLogin = (req, res) => {
    res.render('login', { title: 'Sign In' });
}

//Controller to get register page
exports.getRegister = (req, res) => {
    res.render('register', { title: 'Create an Account' });
}

//MiddleWare to validate user data submitted to register
exports.validateRegister = (req, res, next) => {
    req.checkBody('name', 'Name field cannot be empty').notEmpty();
    req.checkBody('email', 'That Email is not valid').isEmail().notEmpty();
    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    });
    req.checkBody('password', 'Password cannot be Blank!').notEmpty();
    req.checkBody('password-confirm', 'COnfirm Password cannot be empty!').notEmpty();
    req.checkBody('password-confirm', 'Your Passwords do not match').equals(req.body.password);
    const errors = req.validationErrors();
    if (errors) {
        req.flash('danger', errors.map(err => err.msg));
        res.render('register', { title: 'Create an Account', body: req.body, flashes: req.flash() });
        //STop fn from running
        return;
    }
    next();
}

//Middleware to check if user exists already
exports.checkUserExists = async (req, res, next) => {
    const user = await User.find({ email: req.body.email });
    if (user.length) {
        console.log('User Exists');
        //STop fn from running
        req.flash('danger', 'A user with that email Exists Already');
        res.redirect('/register');
        return;
    }
    next();
}

//Middle ware Controller to regsiter user
exports.registerUser = async (req, res) => {
    const user = new User({ email: req.body.email, name: req.body.name });
    const registerWithPromise = promisify(User.register, User);
    await registerWithPromise(user, req.body.password);
    pug.renderFile('./views/email/registerMail.pug', { mail: req.body.email, activationLink: 'activationLink' }, function (err, data) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            mail.send({
                user: req.body.email,
                subject: 'Complete Account Resgistration',
                data: data
            });
            req.flash('success', 'Account Successfully created. Please activate your account using the link sent to your mail');
            res.redirect('/login');
        }
    });
}

//GET USER EDIT ACCOUNT PAGE
exports.editAccount = (req, res) => {
    res.render('editUser', {title: 'Edit My Account'});
}

//Controller to update user account
exports.updateAccount = async (req, res) => {
    const updates = {
        name: req.body.name
    };
    const user = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: updates },
        { new: true, runValidators: true, context: 'query' }
    );
    req.flash('success', 'Updated Profile!');
    res.redirect('back');
}