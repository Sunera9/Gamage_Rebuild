const express = require('express');
const router = express.Router();
const LeaveModel = require('../models/Leave');


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
// router.get("/get", async (req, res) => {
//   try {
//     const leaves = await LeaveModel.find().populate('userId', 'name email'); // Populate user details
//     console.log(leaves);
//     res.status(200).json(leaves);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching leave applications', error: error.message });
//   }
// });

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


// // Get a specific leave application by ID with populated user details
router.route("/get/:id").get(async (req, res) => {
  try {
    const leave = await LeaveModel.findById(req.params.id).populate('User', 'name email');
    if (!leave) {
      return res.status(404).json({ message: 'Leave application not found' });
    }
    res.status(200).json(leave);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leave application', error: error.message });
  }
});

// Update leave application
router.put('/leaves/:id', async (req, res) => {
  try {
    const leave = await LeaveModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!leave) {
      return res.status(404).json({ message: 'Leave application not found' });
    }
    res.status(200).json({ message: 'Leave application updated successfully', leave });
  } catch (error) {
    res.status(400).json({ message: 'Error updating leave application', error: error.message });
  }
});

// Delete leave application
router.delete('/leaves/:id', async (req, res) => {
  try {
    const leave = await LeaveModel.findByIdAndDelete(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave application not found' });
    }
    res.status(200).json({ message: 'Leave application deleted successfully' });
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
