const nodemailer = require('nodemailer');
const promisify = require('es6-promisify');

const transport = nodemailer.createTransport({
  host: process.env.MAIL_SMTP_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

exports.send = async (options) => {
  const mailOptions = {
    from: 'Lawyerup<support@lawyerup.ng>',
    subject: options.subject,
    to: options.user,
    html: options.data,
    text: 'Filled later',
  };
  const sendMail = promisify(transport.sendMail, transport);
  return sendMail(mailOptions);
};
