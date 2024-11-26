const express = require("express");
const router = express.Router();
const TicketModel = require("../models/Ticket");
const { sendEmail } = require("../utils/emailService"); // Assuming the email utility

// Handle ticket acceptance
router.put("/accept/:id", async (req, res) => {
  try {
    // Find the ticket and populate the User field to get the user's email
    const ticket = await TicketModel.findByIdAndUpdate(
      req.params.id,
      { status: "Accepted" }, // Set ticket status to "Accepted"
      { new: true }
    ).populate("User"); // This populates the User field

    if (!ticket) {
      return res.status(404).json({ status: "Ticket not found" });
    }

    // Now, you can access the user's email from the populated User object
    const userEmail = ticket.User.email;

    // Send acceptance email
    await sendEmail(
      userEmail, // Use the user's email from the populated User model
      "Ticket Accepted",
      "Your ticket has been accepted. We are working on your issue."
    );

    res.status(200).json({ status: "Ticket accepted and email sent", ticket });
  } catch (error) {
    res.status(500).json({
      status: "Error accepting ticket",
      error: error.message,
    });
  }
});

// Handle ticket rejection
router.put("/reject/:id", async (req, res) => {
  try {
    // Find the ticket and populate the User field to get the user's email
    const ticket = await TicketModel.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" }, // Set ticket status to "Rejected"
      { new: true }
    ).populate("User"); // This populates the User field

    if (!ticket) {
      return res.status(404).json({ status: "Ticket not found" });
    }

    // Now, you can access the user's email from the populated User object
    const userEmail = ticket.User.email;

    // Send rejection email
    await sendEmail(
      userEmail, // Use the user's email from the populated User model
      "Ticket Rejected",
      "Unfortunately, your ticket has been rejected. Please contact support for further assistance."
    );

    res.status(200).json({ status: "Ticket rejected and email sent", ticket });
  } catch (error) {
    res.status(500).json({
      status: "Error rejecting ticket",
      error: error.message,
    });
  }
});

module.exports = router;
