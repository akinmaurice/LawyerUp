/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/
// FS is a built in module to node that let's us read files from the system we're running on
// const fs = require('fs');

/* moment.js is a handy library for displaying dates.
We need this in our templates to display things like "Posted 5 minutes ago" */
exports.moment = require('moment');

// SETUP MENU VARIABLES FOR INDEX PAGE
exports.menu = [
  {
    title: 'Find Lawyers',
    icon: 'search',
    link: '/directory',
    text: 'Search through our List to find a Lawyer that suits your need.',
  },
  {
    title: 'Best Listings',
    icon: 'thumbs-o-up',
    link: '/agreement',
    text: 'You get the very best and verified Lawyers.',
  },
  {
    title: '24/7 Support',
    icon: 'phone',
    link: '/agreement',
    text: 'We are always available by Phone and Email all round the clock.',
  },
  {
    title: 'Engage a Lawyer',
    icon: 'users',
    link: '/engage',
    text: 'Want us to recommed you a Lawyer?',
  },
  // {  title: 'Free Legal Advice', icon: 'comments-o', link: '/legal-advice'}
];

// Setup TAGS
exports.tags = ['Civil Litigation', 'Corporate Law', 'Labour and Services',
  'Divorce and Alimony', 'Property and Real Estate', 'Criminal Defense',
  'Debt Recovery', 'Transactional Law', 'Immigration', 'Employment', 'Public Interest', 'Dispute Resolution',
];


// CONTACT METHOD
exports.contactMethod = ['Phone Call', 'Email', 'Schedule a Meeting with a Lawyer'];

// LOCATION
exports.location = ['Abia', 'Abuja', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi',
  'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nassarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara',
];

// DIY DOCUMENTS JSON FILE
exports.diy = [{
  title: 'Rent Agreement',
  icon: 'home',
  color: 'default',
  documents: ['Rental Agreement', 'Quit Notice', 'Lease Agreement'],
},
{
  title: 'Business Management',
  icon: 'bar-chart',
  color: 'success',
  documents: ['Business Name Registration', 'Company Incorporation', 'Non-Disclosure', 'Co-Founders Agreement', 'Terms and Conditions'],
},
{
  title: 'Employment',
  icon: 'users',
  color: 'primary',
  documents: ['Job Offer Letter', 'Termination Letter', 'Employment Agreement', 'Non-Disclosure', 'Employee Warning', 'Resignation Letter'],
},
{
  title: 'Settle Disputes',
  icon: 'gavel',
  color: 'danger',
  documents: ['Concillation Agreement', 'Mediation Agreement'],
},
];
// ABOUT PAGE CONTENT
exports.about = 'We are on a journey to make your legal experience remarkable.&nbsp;' +
    'Our law is created to protect us,&nbsp;' +
    'empower us - but many of us either do not get the legal help or refrain from getting involved in&nbsp;' +
    'legal matter due to factors like complexity, lack of knowledge and affordability to name a few.' +
    '<br><br>At Lawyerup, we want to make connecting with lawyers simple, easy, fast and most of all approachable&nbsp;' +
    'by making it available to more people than ever before. Every day we spend time and our resources&nbsp;' +
    'on making Legal easier so that you can focus on the things that matter to you.&nbsp;' +
    '<br><br>So whether you have to incorporate your business, want to connect with a&nbsp;' +
    ' a lawyer for any legal issue, it becomes easy, fast and simple with Lawyerup.';

// CAREERS PAGE CONTENT
exports.careers = ['We’re a team of energetic, talented professionals looking to bring transparency to the legal' +
    'industry. We thrive in fast paced and innovative environments. We are honest, uncensored, ' +
    'and we enjoy sinking our teeth into challenges / problems we don’t know the answers to. ' +
    'We are hungry for success. We enjoy being the best at our trade and like coming to work' +
    '(80% of the time!). We are friendly and always enjoy a good beer (or glass of whiskey) ' +
    'with each other at the end of the day.',
'We work hard and play harder. We strive to deliver an experience that’s unique.&nbsp;' +
    'And above all, we respect our customers through a high quality and transparent product and service offering.',
];

// Terms of Service
exports.termsRegistration = 'You may browse the Site without registering for an account. ' +
    '<br>In order to fully access and use our Services, ' +
  'you must register for an account (“Account”) and provide certain information about yourself ' +
  'as prompted by the account registration form.<br>' +
  '<br>You represent and warrant that: <br>(a) all required ' +
  'registration information you submit is truthful and accurate; <br>(b) you will maintain the accuracy ' +
  'of such information.<br><br>You are responsible for maintaining the confidentiality of ' +
  'your Account login information and are fully responsible for all activities that ' +
  'occur under your Account. You agree to immediately notify Us of any unauthorized use, ' +
  'or suspected unauthorized use of your Account or any other breach of security. We ' +
  'cannot and will not be liable for any loss or damage arising from your failure to comply ' +
  'with the above requirements.';

exports.termsPermittedUse = '';

exports.termsDisclaimer = 'The Site and its Content are provided to you on an "as-is" and "as-available" basis.<br>' +
'We will not be liable for any kind of damage(s) arising from the use of this Site. <br>' +
'We do not guarantee that the site will always be safe, secure or bug free or that the site ' +
'will always function without disruptions, ' +
'delays or imperfections.<br> We are not responsible for the actions or information of third parties, ' +
'and you release us from any claims and damages, known and unknown, ' +
'arising out of or in any way connected with any claim you have against any such third party.';

exports.termsIndemfication = 'If anyone brings a claim against us related to your use of the Site, ' +
'the Content, your User Content or your violation of ' +
'these Terms, you agree to indemnify and hold Us, ' +
'our affiliates, agents, other partners and employees, ' +
'harmless from any loss, liability, claim or demand, including reasonable attorneys fees, ' +
'made by any third party due to or arising out of your use of the Site, ' +
'including also your use of the Site to provide a link to another site or ' +
'to upload content or other information to the Site.';

exports.policyPersonal = 'Your personal details are stored confidentially and will only be used to ' +
'ensure your order is identified to you. Please note that we do not store financial information. <br> ' +
'Only personal information required for registration is collected from users in order to ' +
'search and connect with a lawyer. <br>' +
'We may contact you with information about other products or services you may find useful. ' +
'You have the right to opt out of these mailings at any time by unsubscribing via email. <br> ' +
'Some of your personal information is shared with lawyers ' +
'who you have shown interest in so as to allow them contact you. <br> ' +
'We may provide your personal information when it is necessary to comply with laws or regulations, ' +
'to assist law enforcement, to enforce the terms under which you transacted with WEBSITE, ' +
'or to protect the rights of WEBSITE, users of the Site or others. <br>';

exports.policySecurity = 'This Site has security measures in place to protect the loss, ' +
'misuse and alteration of the information under our control. ' +
'We use 128 bit industry standard Secure Server Software (SSL) for your transactions with us. ' +
'It encrypts all of your personal information so it cannot be read as the information travels over the Internet. <br>';

exports.policy3rdParty = ' We are not responsible for the privacy policies of ' +
'other third parties who may advertise on our site. ' +
'If you follow a link to another web site, please consult ' +
'their individual policy as we are not responsible' +
'for their privacy policies.';
// BAR YEARS
// Get the Start and End Years, then loop through to current year
const startYear = 1991;
const endYear = (new Date()).getFullYear();
const year = [];
for (let i = startYear; i < endYear; i++) {
  year.push(i);
}
exports.years = year;

// GENDER OPTIONS
exports.gender = ['Male', 'Female'];

// App Title
exports.siteName = 'LawyerUp';
