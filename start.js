const mongoose = require('mongoose');

// import environmental variables from our variables.env file
require('dotenv').config();

// Connect to our Database and handle an bad connections
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  logger.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

// Import all of our models
require('./models/User');
require('./models/Lawyer');
require('./models/Request');
require('./models/Job');
require('./models/Appointment');
