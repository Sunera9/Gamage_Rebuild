// /utils/emailService.js
const nodemailer = require("nodemailer");
require("dotenv").config(); // To load environment variables

// Create a transporter using your email provider details (Gmail or SendGrid, etc.)
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use Gmail or another service like SendGrid or Mailgun
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password (use app-specific password if using Gmail)
  },
});

// Function to send email
const sendEmail = (to, subject, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email
    to: to, // Recipient's email
    subject: subject, // Subject of the email
    text: message, // Message body
  };

  // Send email
  return transporter
    .sendMail(mailOptions)
    .then((info) => console.log("Email sent:", info.response))
    .catch((error) => console.log("Error sending email:", error));
};

module.exports = { sendEmail };
