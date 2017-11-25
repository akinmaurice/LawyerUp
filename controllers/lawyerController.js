const mongoose = require('mongoose');
const Lawyer = mongoose.model('Lawyer');
const promisify = require('es6-promisify');
const mail = require('../handlers/mail');
const pug = require('pug');

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
    req.checkBody('password', 'Password cannot be Blank!').notEmpty();
    req.checkBody('password-confirm', 'COnfirm Password cannot be empty!').notEmpty();
    req.checkBody('password-confirm', 'Your Passwords do not match').equals(req.body.password);
    const errors = req.validationErrors();
    if (errors) {
        req.flash('danger', errors.map(err => err.msg));
        res.render('lawyerSignUp', { title: 'Lawyer Sign Up', body: req.body, flashes: req.flash() });
        //STop fn from running
        return;
    }
    next();
}

//Middleware to check if lawyer exists already
exports.checkLawyerExists = async (req, res, next) => {
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
exports.createLawyer = async (req, res) => {
    const lawyer = new Lawyer({ email: req.body.email, name: req.body.name, tags: req.body.tags });
    const registerWithPromise = promisify(Lawyer.register, Lawyer);
    await registerWithPromise(lawyer, req.body.password);
    res.redirect('/');
}

//Controller to Find ALL Lawyers
exports.getLawyers = async (req, res) => {
    //CHeck page number from the params sent in the url or set to 1
    const page = req.params.page || 1;
    //SET LIMIT OF number of Lawyers to return
    const limit = 7;
    //SET THE NUMBER OF Lawyers TO SKIP BASED ON PAGE NUMBER
    const skip = (page * limit) - limit;
    //Query the Database for all the Posts in the DB
    const lawyersPromise = await Lawyer.find().sort({ created: -1 }).skip(skip).limit(limit);
    const countPromise = await Lawyer.count();
    const [lawyers, count] = await Promise.all([lawyersPromise, countPromise]);
    const pages = Math.ceil(count / limit);
    if (!lawyers.length && skip) {
        res.redirect(`/directory/page/${pages}`);
    } else {
        res.render('directory', { title: 'Lawyer Directory', lawyers, page, pages, count })
    }
}

//Controller to get lawyers by tags
exports.getLawyersByTags = async (req, res) => {
    //CHeck page number from the params sent in the url or set to 1
    const page = req.params.page || 1;
    //SET LIMIT OF number of Lawyers to return
    const limit = 7;
    //SET THE NUMBER OF Lawyers TO SKIP BASED ON PAGE NUMBER
    const skip = (page * limit) - limit;
    const tag = req.params.tag;
    const tagQuery = tag || { $exists: true };
    const tagsPromise = await Lawyer.getTagsList();
    const lawyersPromise = await Lawyer.find({ tags: tagQuery }).sort({ created: -1 }).skip(skip).limit(limit);
    const countPromise = await Lawyer.find({ tags: tagQuery }).count();
    const [tags, lawyers, count] = await Promise.all([tagsPromise, lawyersPromise, countPromise]);
    const pages = Math.ceil(count / limit);
    if (!lawyers.length && skip) {
        res.redirect(`/directory/page/${pages}`);
    } else {
        console.log(count, page, pages)
        res.render('tags', { tags, title: `${tag} Lawyers`, lawyers, count, page, pages, tag });
    }
}

//CONTROLLER TO GET LAWYER BY SLUG
exports.getLawyerBySlug = async (req, res) => {
    const lawyer = await Lawyer.findOne({ slug: req.params.slug });
    if (!lawyer) {
        res.redirect('/error'); //Send them to 404 page!
        return;
    }
    res.render('lawyer', { title: `${lawyer.name} Attorney Profile`, lawyer });
}

//controller to contact lawyer get the form
exports.getContactLawyerForm = async (req, res) => {
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