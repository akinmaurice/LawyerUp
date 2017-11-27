const mongoose = require('mongoose');
const passport = require('passport');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const crypto = require('crypto');
const mail = require('../handlers/mail');
const pug = require('pug');


//MIDDLE WARE TO CHECK IF THE USER STATUS IS ACTIVE BEFORE ALLOWING THEM LOGIN
exports.checkUserStatus = async(req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    //Check if the User Exists!
    if (!user) {
        req.flash('danger', 'No User with that email found')
        res.redirect('/login');
        //STop fn from running
        return;
        //Check if the User Status is Active
    } else if (user.status === false) {
        req.flash('danger', 'Your Account has not been activated yet. please use the link sent to your email or reset your password to get another link!')
        res.redirect('/login');
        //STop fn from running
        return;
    }
    next();
}

//Login Controller
exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Failed Login!',
    successRedirect: '/'
});

//Logout Controller
exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'you are now logged out');
    res.redirect('/');
}

//Middle ware to rrstrict page access
exports.isLoggedIn = (req, res, next) => {
    //Check if user is authenticated
    if (req.isAuthenticated()) {
        next();
        return;
    }
    req.flash('danger', 'LOG IN TO ACCESS THAT PAGE!');
    res.redirect('/login');
}

//GET USER EDIT PASSWORD PAGE
exports.editPassword = (req, res) => {
    res.render('editPassword', { title: 'Edit Password' });
}

//Controller to update user account
exports.updatePassword = async(req, res) => {
    const user = await User.findOne({

    });
}

//Controller to get reset page
exports.getForgot = (req, res) => {
    res.render('forgot', { title: 'Forgot Password' });
}

//Controller to reset Password user
exports.forgot = async(req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        req.flash('success', 'Reset Link Sent');
        res.render('login', { title: 'Sign In', flashes: req.flash() });
    } else {
        //GENERATE TOKEN AND SET TIME TO RESET PASSWORD
        user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
        //SET TIME EXPIRES AS ONE HOUR FROM NOW
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();
        //Send Mail to the user with a token to reset the account
        const resetUrl = `http://${req.headers.host}/user/reset/${user.resetPasswordToken}`;
        pug.renderFile(`${__dirname}/../views/email/resetMail.pug`, { mail: req.body.email, resetLink: resetUrl }, function(err, data) {
            if (err) {
                req.flash('success', 'Reset Link Sent');
                res.render('login', { title: 'Sign In', flashes: req.flash() });
            } else {
                //Send Emai to the user
                mail.send({
                    user: req.body.email,
                    subject: 'Account Password Reset',
                    data: data
                })
                console.log(resetUrl);
                req.flash('success', 'Reset Link Sent');
                res.render('login', { title: 'Sign In', flashes: req.flash() });
            }
        });
    }
}

//Controller to Reset
exports.reset = async(req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
        req.flash('danger', 'Password reset Invalid or has expired!')
        res.redirect('/login');
    } else {
        res.render('reset', { title: 'Reset Password' });
    }
}

//MIDDLEWARE TO CHECK IF PASSWORDS MATCH FOR RESET
exports.confirmedPasswords = (req, res, next) => {
    if (req.body.password === req.body.passwordConfirm) {
        next(); //MOVE TO THE NEXT FUNCTION
        return;
    } else {
        req.flash('danger', 'Passwords Do not Match!');
        res.redirect('back');
    }
}

//UPDATE PASSWORD RESET
exports.update = async(req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
        req.flash('danger', 'Password reset Invalid or has expired!')
        res.redirect('/login');
    } else {
        const setPassword = promisify(user.setPassword, user);
        await setPassword(req.body.password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        const updatedUser = await user.save();
        await req.login(updatedUser);
        res.redirect('/');
    }
}