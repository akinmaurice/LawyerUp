/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/

// FS is a built in module to node that let's us read files from the system we're running on
const fs = require('fs');

// moment.js is a handy library for displaying dates. We need this in our templates to display things like "Posted 5 minutes ago"
exports.moment = require('moment');

//SETUP MENU VARIABLES FOR INDEX PAGE
exports.menu = [
  { title: 'Engage a Lawyer', icon: 'users', link: '/engage' },
  { title: 'Find Lawyers', icon: 'search', link: '/directory' },
  { title: 'Business Name Registration', icon: 'trademark', link: '/agreement' },
  { title: 'Draft Legal Agreements', icon: 'file-text-o', link: '/agreement' }
  //{  title: 'Free Legal Advice', icon: 'comments-o', link: '/legal-advice'}
];

//Setup TAGS
exports.tags = ['Civil Litigation', 'Corporate Law', 'Labour and Services',
  'Divorce and Alimony', 'Property and Real Estate', 'Criminal Defense',
  'Debt Recovery', 'Transactional Law', 'Immigration', 'Employment', 'Public Interest', 'Dispute Resolution'];


//CONTACT METHOD
exports.contactMethod = ['Phone Call', 'Email', 'Schedule a Meeting with a Lawyer'];

//LOCATION
exports.location = ['Abia', 'Abuja', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi',
  'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nassarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara'];


// Dump is a handy debugging function we can use to sort of "console.log" our data
exports.dump = (obj) => JSON.stringify(obj, null, 2);


//DIY DOCUMENTS JSON FILE
exports.diy = [
  {title: 'Rent Agreement', icon: 'home', color: 'default' , documents: ['Rental Agreement', 'Quit Notice', 'Lease Agreement']},
  {title: 'Business Management', icon: 'bar-chart', color: 'success' , documents: ['Business Name Registration', 'Company Incorporation', 'Non-Disclosure', 'Co-Founders Agreement', 'Terms and Conditions']},
  {title: 'Employment', icon: 'users', color: 'primary' , documents: ['Job Offer Letter', 'Termination Letter' , 'Employment Agreement', 'Non-Disclosure', 'Employee Warning', 'Resignation Letter']},
  {title: 'Settle Disputes', icon: 'gavel', color: 'danger' , documents: ['Concillation Agreement', 'Mediation Agreement']}
];
//ABOUT PAGE CONTENT
exports.about = 'We are on a journey to make your legal experience remarkable.&nbsp;'
  + 'Our law is created to protect us,&nbsp;'
  + 'empower us - but many of us either do not get the legal help or refrain from getting involved in&nbsp;'
  + 'legal matter due to factors like complexity, lack of knowledge and affordability to name a few.'
  + '<br><br>At Lawyerup, we want to make connecting with lawyers simple, easy, fast and most of all approachable&nbsp;'
  + 'by making it available to more people than ever before. Every day we spend time and our resources&nbsp;'
  + 'on making Legal easier so that you can focus on the things that matter to you.&nbsp;'
  + '<br><br>So whether you have to incorporate your business, want to connect with a&nbsp;'
  + ' a lawyer for any legal issue, it becomes easy, fast and simple with Lawyerup.'

//CAREERS PAGE CONTENT
exports.careers = ['We’re a team of energetic, talented professionals looking to bring transparency to the legal'
                    +'industry. We thrive in fast paced and innovative environments. We are honest, uncensored, '
                    +'and we enjoy sinking our teeth into challenges / problems we don’t know the answers to. '
                    +'We are hungry for success. We enjoy being the best at our trade and like coming to work'
                    +'(80% of the time!). We are friendly and always enjoy a good beer (or glass of whiskey) '
                    +'with each other at the end of the day.',
                    'We work hard and play harder. We strive to deliver an experience that’s unique.&nbsp;'
                    +'And above all, we respect our customers through a high quality and transparent product and service offering.'
                  ];

//BAR YEARS
exports.years = ['1990', '1991', '1992'];

//GENDER OPTIONS
exports.gender = ['Male', 'Female'];

// App Title
exports.siteName = `Lawyerup`;

