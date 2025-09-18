const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true para porta 465, false para outras
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Função para centralizar o envio de e-mails.
 * @param {object} mailOptions - Opções do e-mail (from, to, subject, etc).
 */
const sendMail = async (mailOptions) => {
  return transporter.sendMail(mailOptions);
};

module.exports = { transporter, sendMail };