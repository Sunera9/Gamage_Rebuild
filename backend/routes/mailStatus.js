require('dotenv').config();
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const MailStatusModel = require('../models/MailStatus');
const UserModel = require('../models/User');

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gamagerecruiters3@gmail.com',  
    pass: 'imcv hqah xfuq dlda',
  },
});

// Route for sending offer letter email and saving status
router.post('/', async (req, res) => {
  const { userId } = req.body;

  try {
    console.log('Sending email for user ID:', userId);
    const user = await UserModel.findById(userId).populate('jobPosition');

    if (!user) {
        console.log('User not found');
        return res.status(404).json({ status: 'User not found' });
      }
  
      if (!user.jobPosition || !user.jobPosition.title) {
        console.log('Job position not found for user:', user.jobPosition);
        return res.status(400).json({ status: 'Job position not found for user' });
      }

    // Compose email content dynamically using user's job position
    const emailSubject = `Offer Letter for the position of ${user.jobPosition.title}`;
    const emailBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #007bff;">Offer Letter</h2>
        <p>Dear ${user.name},</p>
        <p>We are delighted to extend to you an offer for the position of <strong>${user.jobPosition ? user.jobPosition.title : 'N/A'}</strong> at <strong>Gamage Recruiters</strong>. We believe that your skills and experience will be an invaluable asset to our team.</p>
        
        <h2 style="color: #007bff;">Employment Details</h2>
        <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;"><strong>Start Date</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">${new Date(user.startDate).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;"><strong>End Date</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">${new Date(user.endDate).toLocaleDateString()}</td>
          </tr>
          
        </table>
        
        <p>Please note that this offer is contingent upon the completion of all required background checks and documentation.</p>
        
        <p>If you choose to accept this offer, please sign and return the attached acceptance form by [insert deadline date].</p>
        
        <p>We are excited to have you join our team and contribute to the continued success of our company. Should you have any questions or need further clarification, please do not hesitate to contact us.</p>
        
        <p>We look forward to welcoming you to <strong>[Company Name]</strong>.</p>
        
        <p>Warmest regards,</p>
        <p><strong>[Your Name]</strong></p>
        <p><em>[Your Position]</em></p>
        <p><strong>[Company Name]</strong></p>
      </div>
    `;
    

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: emailSubject,
      html: emailBody,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', user.email);

    // Save email status
    const mailStatus = new MailStatusModel({
      userId: userId,
      status: 'Sent',
      errorMessage: null,
    });

    await mailStatus.save();
    res.status(200).json({ status: 'success', mailStatus });

  } catch (error) {
    console.error('Error in sending email:', error);
    res.status(500).json({ status: 'Error sending email', error: error.message });
  }
});

// Route for checking email status
router.get('/check-status/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const emailStatus = await MailStatusModel.findOne({ userId });

    if (emailStatus) {
      res.status(200).json({ emailSent: true });
    } else {
      res.status(200).json({ emailSent: false });
    }
  } catch (error) {
    console.error(`Error fetching email status for user ID ${req.params.userId}:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
