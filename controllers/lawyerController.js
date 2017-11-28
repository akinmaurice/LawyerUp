const mongoose = require('mongoose');
const Lawyer = mongoose.model('Lawyer');
const promisify = require('es6-promisify');
const mail = require('../handlers/mail');
const pug = require('pug');
const crypto = require('crypto');
const moment = require('moment');

//Controller to get lawyer Registration Page
exports.registerLawyer = (req, res) => {
    res.render('lawyerSignUp', { title: 'Lawyer Sign Up' });
}

//MiddleWare to validate  data submitted to register Lawyer
exports.validateLawyer = (req, res, next) => {
    req.checkBody('name', 'Name field cannot be empty').notEmpty();
    req.checkBody('email', 'That Email is not valid').isEmail().notEmpty();
    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    });
    req.checkBody('rate', 'Rate cannot be Blank!').notEmpty();
    req.checkBody('location', 'Please select a valid location!').notEmpty();
    req.checkBody('gender', 'Please select a valid gender!').notEmpty();
    req.checkBody('barYear', 'Please select a valid bar year!').notEmpty();
    req.checkBody('about', 'About cannot be Blank!').notEmpty();
    req.checkBody('tags', 'Please select at least one of the tags!').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        const email = req.body.email;
        const name = req.body.name;
        const rate = req.body.rate;
        const about = req.body.about;
        req.flash('danger', errors.map(err => err.msg));
        res.render('lawyerSignUp', { title: 'Lawyer Sign Up', email, name, rate, about, flashes: req.flash() });
        //STop fn from running
        return;
    }
    next();
}

//Middleware to check if lawyer exists already
exports.checkLawyerExists = async(req, res, next) => {
    const lawyer = await Lawyer.find({ email: req.body.email });
    if (lawyer.length) {
        //STop fn from running
        req.flash('danger', 'A user with that email Exists Already');
        res.redirect('/join-us');
        return;
    }
    next();
}

//Controller to Create Lawyer
exports.createLawyer = async(req, res) => {
    //GENERATE TOKEN AND SET TIME TO Activate Account
    req.body.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    //SET TIME EXPIRES AS ONE HOUR FROM NOW
    req.body.resetPasswordExpires = Date.now() + 3600000;
    //GET THE DATE SUPPLIED BY USER AND CONVERT TO DATE FUNCTION
    const dateString = req.body.barYear;
    const dateObj = new Date(dateString);
    const momentObj = moment(dateObj);
    const momentDate = momentObj.format('YYYY-MM-DD');
    const lawyer = new Lawyer({
        email: req.body.email,
        name: req.body.name,
        tags: req.body.tags,
        rate: req.body.rate,
        about: req.body.about,
        gender: req.body.gender,
        barYear: momentDate,
        location: req.body.location,
        resetPasswordExpires: req.body.resetPasswordExpires,
        resetPasswordToken: req.body.resetPasswordToken
    });
    const registerWithPromise = promisify(Lawyer.register, Lawyer);
    await registerWithPromise(lawyer, req.body.password);
    const activationLink = `http://${req.headers.host}/lawyer/activate/${lawyer.resetPasswordToken}`;
    pug.renderFile('./views/email/registerMail.pug', { mail: req.body.email, activationLink }, function(err, data) {
        if (err) {
            req.flash('success', 'Account Successfully created. Please activate your account using the link sent to your mail');
            res.redirect('/join-us');
        } else {
            mail.send({
                user: req.body.email,
                subject: 'Complete Account Resgistration',
                data: data
            });
            req.flash('success', 'Account Successfully created. Please activate your account using the link sent to your mail');
            res.redirect('/join-us');
        }
    });
}

//Controller to Find ALL Lawyers
exports.getLawyers = async(req, res) => {
    //CHeck page number from the params sent in the url or set to 1
    const page = req.params.page || 1;
    //SET LIMIT OF number of Lawyers to return
    const limit = 7;
    //SET THE NUMBER OF Lawyers TO SKIP BASED ON PAGE NUMBER
    const skip = (page * limit) - limit;
    //CHECK FOR THE AVAILABLE TAGS
    const tagQuery = { $exists: true };
    const tagsPromise = await Lawyer.getTagsList();
    //Query the Database for all the Posts in the DB
    const lawyersPromise = await Lawyer.find({ status: true }).sort({ created: -1 }).skip(skip).limit(limit);
    const countPromise = await Lawyer.count();
    const [lawyers, tags, count] = await Promise.all([lawyersPromise, tagsPromise, countPromise]);
    const pages = Math.ceil(count / limit);
    if (!lawyers.length && skip) {
        res.redirect(`/directory/page/${pages}`);
    } else {
        res.render('directory', { title: 'Lawyer Directory', lawyers, page, pages, count, tags })
    }
}

//Controller to get lawyers by tags
exports.getLawyersByTags = async(req, res) => {
    //CHeck page number from the params sent in the url or set to 1
    const page = req.params.page || 1;
    //SET LIMIT OF number of Lawyers to return
    const limit = 7;
    //SET THE NUMBER OF Lawyers TO SKIP BASED ON PAGE NUMBER
    const skip = (page * limit) - limit;
    const tag = req.params.tag;
    const tagQuery = tag || { $exists: true };
    const tagsPromise = await Lawyer.getTagsList();
    const lawyersPromise = await Lawyer.find({ tags: tagQuery, status: true }).sort({ created: -1 }).skip(skip).limit(limit);
    const countPromise = await Lawyer.find({ tags: tagQuery }).count();
    const [tags, lawyers, count] = await Promise.all([tagsPromise, lawyersPromise, countPromise]);
    const pages = Math.ceil(count / limit);
    if (!lawyers.length && skip) {
        res.redirect(`/directory/page/${pages}`);
    } else {
        console.log(count, page, pages, tags)
        res.render('tags', { tags, title: `${tag} Lawyers`, lawyers, count, page, pages, tag });
    }
}

//CONTROLLER TO GET LAWYER BY SLUG
exports.getLawyerBySlug = async(req, res) => {
    const lawyer = await Lawyer.findOne({ slug: req.params.slug });
    if (!lawyer) {
        res.redirect('/error'); //Send them to 404 page!
        return;
    }
    res.render('lawyer', { title: `${lawyer.name} Attorney Profile`, lawyer });
}

//controller to contact lawyer get the form
exports.getContactLawyerForm = async(req, res) => {
    const lawyer = await Lawyer.findOne({ slug: req.params.slug });
    if (!lawyer) {
        res.redirect('/error'); //Send them to 404 page!
        return;
    }
    res.render('contactLawyer', { title: `Contact ${lawyer.name}`, lawyer });
}

// Controller get Lawyer login
exports.getLogin = (req, res) => {
    res.redirect('http://localhost:6969');
}

//ACTIVATE LAWYER ACCOUNT
exports.activate = async(req, res) => {
    const lawyer = await Lawyer.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if (!lawyer) {
        req.flash('danger', 'Activation Token Invalid or has expired! Kindly reset your password to confirm')
            //redirect to login page for lawyers here
        res.redirect('/login');
    } else {
        const updates = {
            status: true
        };
        const lawyerActivate = await Lawyer.findOneAndUpdate({ _id: lawyer._id }, { $set: updates }, { new: true, runValidators: true, context: 'query' });
        req.flash('success', 'Account Activated!')
            //redirect to login page for lawyers
        res.redirect('/login');
    }
}