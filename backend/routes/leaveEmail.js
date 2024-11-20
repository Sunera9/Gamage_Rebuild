const express = require("express");
const router = express.Router();
const LeaveModel = require("../models/Leave");
const { sendEmail } = require("../utils/emailService");

// Handle leave acceptance
router.put("/accept/:id", async (req, res) => {
  try {
    const leave = await LeaveModel.findByIdAndUpdate(
      req.params.id,
      { adminApproval: "Approved" },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ status: "Leave application not found" });
    }

    // Send approval email
    await sendEmail(
      leave.email, // Assuming userId is the user's email
      "Leave Application Approved",
      "Your leave application has been approved."
    );

    res
      .status(200)
      .json({ status: "Leave application approved and email sent", leave });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "Error approving leave application",
        error: error.message,
      });
  }
});

// Handle leave rejection
router.put("/reject/:id", async (req, res) => {
  try {
    const leave = await LeaveModel.findByIdAndUpdate(
      req.params.id,
      { adminApproval: "Rejected" },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ status: "Leave application not found" });
    }

    // Send rejection email
    await sendEmail(
      leave.email, // Assuming userId is the user's email
      "Leave Application Rejected",
      "Your leave application has been rejected."
    );

    res
      .status(200)
      .json({ status: "Leave application rejected and email sent", leave });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "Error rejecting leave application",
        error: error.message,
      });
  }
});

module.exports = router;
