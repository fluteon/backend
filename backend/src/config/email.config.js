const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_HOST,
  port: parseInt(process.env.BREVO_PORT),
  secure: false, // false for port 587 (TLS)
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

module.exports = transporter;
