const express = require('express');
const router = express.Router();
const LeaveModel = require('../models/Leave');

// Create a new leave application
router.route("/add").post(async (req, res) => {
  try {
    const leave = new LeaveModel(req.body);
    await leave.save();
    res.status(201).json({ status: "Leave application created successfully", leave });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "Error creating leave application", error: error.message });
  }
});

// Get all leave applications with populated user details
router.route("/get").get(async (req, res) => {
  try {
    const leaves = await LeaveModel.find().populate('userId', 'name email');
    res.status(200).json(leaves);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "Error fetching leave applications", error: error.message });
  }
});

// Get a specific leave application by ID with populated user details
router.route("/get/:id").get(async (req, res) => {
  try {
    const leave = await LeaveModel.findById(req.params.id).populate('userId', 'name email');
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
    const leave = await LeaveModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
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

module.exports = router;
