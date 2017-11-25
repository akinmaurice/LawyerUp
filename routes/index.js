var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const appController = require('../controllers/appController');
const authController = require('../controllers/authController');
const lawyerController = require('../controllers/lawyerController');
const appointmentController = require('../controllers/appointmentController');
const { catchErrors } = require('../handlers/errorHandlers');

/* GET Homepage. */
router.get('/', appController.getHomepage);

/* GET about Page. */
router.get('/about', appController.getAbout);

/* GET contact Page. */
router.get('/contact', appController.getContact);

/* GET DIY AGREEMENTS Page. */
router.get('/agreement', appController.getDiy);

/* GET DIY AGREEMENTS Page. */
router.get('/appointment', appController.getAppointment);

/* GET  CALL BACK Page. */
router.get('/call-request', appController.getCallBack);

/* GET DISCLAIMER Page. */
router.get('/disclaimer', appController.getDisclaimer);

/* GET TERMS Page. */
router.get('/terms', appController.getTerms);

/* GET PLOCY Page. */
router.get('/policy', appController.getPolicy);

/* GET  FAQ Page. */
router.get('/faq', appController.getFaq);

/* GET  LAWYER DIRECTORY Page. */
router.get('/directory',
    authController.isLoggedIn,
    catchErrors(lawyerController.getLawyers)
);

/* Rouute to get Lawyers paginated pages */
router.get('/directory/page/:page',
    authController.isLoggedIn,
    catchErrors(lawyerController.getLawyers)
);

/* GET Login. */
router.get('/login', userController.getLogin);

/* Login User. */
router.post('/login', authController.login);

/* Logout User. */
router.get('/logout', authController.logout);

/* GET Register Page. */
router.get('/register', userController.getRegister);

/* POST Register. */
router.post('/register',
    userController.validateRegister,
    userController.checkUserExists,
    userController.registerUser
);
/* GET Forgot Password Page. */
router.get('/forgot', authController.getForgot);

/*Reset User Account. */
router.post('/forgot', catchErrors(authController.forgot));

/*ROute to Post Contact Us*/
router.post('/contact', appController.contactUs);

/*ROute to Post Call Back Request*/
router.post('/call-request', appController.callBack);

/*ROute to get Lawyer Reg Page*/
router.get('/join-us', lawyerController.registerLawyer);

/*ROute to Create New Lawyer*/
router.post('/join-us',
    lawyerController.validateLawyer,
    lawyerController.checkLawyerExists,
    lawyerController.createLawyer
);

/* Route to get lawyers by tag */
router.get('/tags/:tag',
    authController.isLoggedIn,
    catchErrors(lawyerController.getLawyersByTags)
);

/* Rouute to get Lawyers by tags paginated pages */
router.get('/tags/:tag/directory/page/:page',
    authController.isLoggedIn,
    catchErrors(lawyerController.getLawyersByTags)
);

/*Route to get the engage lawyer Page. */
router.get('/engage',
    authController.isLoggedIn,
    appController.engageLawyer
);

/* ROute to handle get Legal Advice Page */
router.get('/legal-advice',
    authController.isLoggedIn,
    appController.legalAdvice
);

//ROUTE TO POST REQUEST LAWYER AND FREE ADVICE
router.post('/engage',
    authController.isLoggedIn,
    appController.verifyRequest,
    appController.requestLawyer
);

//ROUTE TO GET EDIT USER PAGE
router.get('/user/edit-profile',
    authController.isLoggedIn,
    userController.editAccount
);

//ROUTE TO UPDATE USER ACCOUNT
router.post('/user/edit-profile',
    authController.isLoggedIn,
    catchErrors(userController.updateAccount)
);


//ROUTE TO GET EDIT PASSWORD PAGE
router.get('/user/edit-password',
    authController.isLoggedIn,
    authController.editPassword
);

//ROUTER TO RESET USER PASSWORD
router.get('/user/reset/:token',
    catchErrors(authController.reset)
);

//ROUTER TO UPDATE THE USERS PASSWORDS THROUGH RESET
router.post('/user/reset/:token',
    authController.confirmedPasswords,
    catchErrors(authController.update)
);

//ROUTE TO GET LAWYERS PAGE BY SLUG
router.get('/attorney/:slug',
    authController.isLoggedIn,
    catchErrors(lawyerController.getLawyerBySlug)
);

//ROUTE TO GET CONTACT LAWYER FORM
router.get('/contact-lawyer/:slug',
    authController.isLoggedIn,
    catchErrors(lawyerController.getContactLawyerForm)
);

//ROUTE TO SEND MESSAGE TO LAWYER
router.post('/contact-lawyer/:slug',
    authController.isLoggedIn,
    appointmentController.validateInput,
    catchErrors(appointmentController.createAppointment)
);

//Router to Get Careers Page
router.get('/career', catchErrors(appController.careers));

//ROUTER FOR LAWYER SIGN IN
router.get('/lawyer/login', lawyerController.getLogin);

module.exports = router;
