const mongoose = require('mongoose');
const express = require('express');

// import environmental variables from config file
const config = require('./config');

mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
// Connect to our Database and handle an bad connections
mongoose.connect(config.mongoDB.uri)
  .then(() => {
    logger.info(`Connected to the Database Environment on ${config.appEnv}`);
  })
  .catch((error) => {
    logger.error(`Could not connect to Database Environment on ${config.appEnv} 🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${error}`);
  });


// Import all of our models
require('./models/User');
require('./models/Lawyer');
require('./models/Request');
require('./models/Job');
require('./models/Appointment');


// Require App Here
const app = require('./app');
// Start Server
app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  logger.debug('##########################################################');
  logger.debug('#####               STARTING SERVER                  #####');
  logger.debug('##########################################################\n');
  logger.info(`Application Running → PORT ${server.address().port}`);
});
