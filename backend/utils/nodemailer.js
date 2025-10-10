const nodemailer = require("nodemailer");

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "98e6a2001@smtp-brevo.com",
    pass: "scA58NjXLOBbRvfp",
  },
});


module.exports = {transporter}