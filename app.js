const express = require('express');
const session = require('express-session');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const helmet = require('helmet');
const favicon = require('serve-favicon');
const logger = require('morgan');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const promisify = require('es6-promisify');
const flash = require('connect-flash');
const helpers = require('./helpers');
const errorHandlers = require('./handlers/errorHandlers');
// const csrf = require('csurf');


// import passport helper files
require('./handlers/passport');


// READY?! Let's go!

// Import routes
const index = require('./routes/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Exposes a bunch of methods for validating data. Used heavily on userController.validateRegister
app.use(expressValidator());

app.use(cookieParser());
// Sessions allow us to store data on visitors from request to request
// This keeps users logged in and allows us to send flash messages
app.use(session({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));

// // Passport JS is what we use to handle our logins
app.use(passport.initialize());
app.use(passport.session());

// // The flash middleware let's us use req.flash('error', 'Shit!'),
// which will then pass that message to the next page the user requests
app.use(flash());
// CSRF TOKEN
// app.use(csrf());

/* app.use( function( req, res, next ) {
  res.locals.csrftoken = req.csrfToken() ;
  next() ;
}) ; */


app.use(express.static(path.join(__dirname, 'public')));

// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path;
  next();
});

// promisify some callback based APIs
app.use((req, res, next) => {
  req.login = promisify(req.login, req);
  next();
});

// SECURITY HELMET SET UP
app.use(helmet.noCache());
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
// app.use(helmet.contentSecurityPolicy({
// directives: {
// defaultSrc: ["'self'"],
// styleSrc: ["'self'", 'fonts.googleapis.com']
// }
// }));
const ninetyDaysInSeconds = 7776000;
app.use(helmet.hpkp({
  maxAge: ninetyDaysInSeconds,
  sha256s: ['AbCdEf123=', 'ZyXwVu456='],
  includeSubdomains: true,
}));
// After allllll that above middleware, we finally handle our own routes!
app.use('/', index);

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

// done! we export it so we can start the site in start.js
module.exports = app;
