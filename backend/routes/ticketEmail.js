const express = require("express");
const router = express.Router();
const TicketModel = require("../models/Ticket"); // Assuming Ticket model is set up similarly to LeaveModel
const { sendEmail } = require("../utils/emailService"); // Reusing the email utility

// Handle ticket acceptance
router.put("/accept/:id", async (req, res) => {
  try {
    const ticket = await TicketModel.findByIdAndUpdate(
      req.params.id,
      { status: "Accepted" }, // Set ticket status to "Accepted"
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ status: "Ticket not found" });
    }

    // Send acceptance email
    await sendEmail(
      ticket.userEmail, // Assuming the ticket contains user's email
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
    const ticket = await TicketModel.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" }, // Set ticket status to "Rejected"
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ status: "Ticket not found" });
    }

    // Send rejection email
    await sendEmail(
      ticket.userEmail, // Assuming the ticket contains user's email
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
