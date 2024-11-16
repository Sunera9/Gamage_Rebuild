const nodemailer = require("nodemailer");
require("dotenv").config(); // To load environment variables

// Create a transporter using your email provider details (Gmail or other)
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use Gmail or another service
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password if using Gmail
  },
  tls: {
    rejectUnauthorized: false, // Ignore self-signed certificate issues (use only in development)
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
