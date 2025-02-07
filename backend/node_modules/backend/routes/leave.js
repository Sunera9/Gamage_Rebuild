const express = require('express');
const router = express.Router();
const LeaveModel = require('../models/Leave');
const UserModel = require('../models/User'); // Import the User model
const authMiddleware = require("../middlewares/authMiddleware"); // Import your auth middleware

// Create a new leave application
router.post('/add', async (req, res) => {
  try {
    const { duration, startDate, endDate, type, reason } = req.body;

    // Validate duration
    if (!['Half Day', 'Full Day'].includes(duration)) {
      return res.status(400).json({
        status: 'Invalid duration value. It must be "Half Day" or "Full Day".',
      });
    }

    // Create a new leave
    const leave = new LeaveModel({
      duration,
      startDate,
      User: req.body.userId, // Save the user's ID
      endDate,
      type,
      reason,
    });

    await leave.save();
    res.status(201).json({ status: 'Leave application created successfully', leave });
  } catch (error) {
    console.error('Error creating leave application:', error);
    res.status(400).json({ status: 'Error creating leave application', error: error.message });
  }
});

// Get all leave applications with populated user details
router.get("/get", async (req, res) => {
  try {
    const leaves = await LeaveModel.find().populate('User', 'name email');
    res.status(200).json(leaves);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "Error fetching leave applications", error: error.message });
  }
});

// Get a specific leave application by ID with populated user details
router.route("/get/:id").get(async (req, res) => {
  try {
    const leave = await LeaveModel.findById(req.params.id).populate('User', 'name email');
    if (!leave) {
      return res.status(404).json({ status: "Leave application not found" });
    }
    res.status(200).json({ status: "Leave application fetched", leave });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "Error fetching leave application", error: error.message });
  }
});

// Update a leave application by ID
router.route("/update/:id").put(async (req, res) => {
  try {
    const { duration, ...rest } = req.body;

    // Validate duration if provided
    if (duration && !['Half Day', 'Full Day'].includes(duration)) {
      return res.status(400).json({ status: "Invalid duration value. It must be 'Half Day' or 'Full Day'" });
    }

    const leave = await LeaveModel.findByIdAndUpdate(
      req.params.id,
      { ...rest, ...(duration && { duration }) },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ status: "Leave application not found" });
    }
    res.status(200).json({ status: "Leave application updated successfully", leave });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "Error updating leave application", error: error.message });
  }
});

// Delete a leave application by ID
router.route("/delete/:id").delete(async (req, res) => {
  try {
    const leave = await LeaveModel.findByIdAndDelete(req.params.id);
    if (!leave) {
      return res.status(404).json({ status: "Leave application not found" });
    }
    res.status(200).json({ status: "Leave application deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "Error deleting leave application", error: error.message });
  }
});

// // Get leave requests for a specific user
// router.get("/leaves/user/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params; // Extract userId from request parameters
//     const leaves = await LeaveModel.find({ User: userId }).populate('User', 'name email'); // Filter by userId
//     if (!leaves || leaves.length === 0) {
//       return res.status(404).json({ status: "No leave applications found for this user." });
//     }
//     res.status(200).json(leaves);
//   } catch (error) {
//     console.error("Error fetching user-specific leaves:", error.message);
//     res.status(500).json({ status: "Failed to fetch leave requests.", error: error.message });
//   }
// });

module.exports = router;
