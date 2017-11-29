const mongoose = require('mongoose');

// import environmental variables from our variables.env file
require('dotenv').config();

// Connect to our Database and handle an bad connections
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

// READY?! Let's go!

// Import all of our models
require('./models/User');
require('./models/Lawyer');
require('./models/Request');
require('./models/Appointment');
require('./models/Job');
