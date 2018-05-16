const path = require('path');


// import environmental variables from our variables.env file
require('dotenv').config();


const defaults = {
  root: path.normalize(`${__dirname}/..`),
  webserver: {
    port: process.env.PORT || '3000',
  },
  application_logging: {
    file: process.env.LOG_PATH,
    level: process.env.LOG_LEVEL || 'info',
    console: process.env.LOG_ENABLE_CONSOLE || true,
  },
  appEnv: process.env.NODE_ENV,
  mongoDB: {
    uri: process.env.DATABASE,
  },
  appSecret: process.env.SECRET,
  appMailer: {
    smtpHost: process.env.MAIL_SMTP_HOST,
    mailUser: process.env.MAIL_USER,
    mailPass: process.env.MAIL_PASS,
    mailPort: process.env.MAIL_PORT,
  },
};


module.exports = defaults;
