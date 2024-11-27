const express = require('express');
const router = express.Router();
const LeaveModel = require('../models/Leave');


// Create a new leave application
router.post('/leaves', async (req, res) => {
  try {
    const leave = new LeaveModel(req.body);
    await leave.save();
    res.status(201).json({ message: 'Leave application created successfully', leave });
  } catch (error) {
    res.status(400).json({ message: 'Error creating leave application', error: error.message });
  }
});

// Get all leave applications
router.get('/leaves', async (req, res) => {
  try {
    const leaves = await LeaveModel.find().populate('userId', 'name email'); // Populate user details
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leave applications', error: error.message });
  }
});

// Get a specific leave application by ID
router.get('/leaves/:id', async (req, res) => {
  try {
    const leave = await LeaveModel.findById(req.params.id).populate('userId', 'name email');
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
    res.status(500).json({ message: 'Error deleting leave application', error: error.message });
  }
});

module.exports = router;
