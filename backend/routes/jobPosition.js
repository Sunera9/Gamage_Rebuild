const express = require('express');
const router = express.Router();
const JobPositionModel = require('../models/JobPosition');

// Get all job positions
router.route("/").get(async (req, res) => {
  try {
    const jobPositions = await JobPositionModel.find();
    res.json(jobPositions);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "Error fetching job positions", error: err.message });
  }
});

// Get a job position by ID
router.route("/:id").get(async (req, res) => {
  const id = req.params.id;
  try {
    const jobPosition = await JobPositionModel.findById(id);
    if (!jobPosition) {
      return res.status(404).json({ status: "Job position not found" });
    }
    res.status(200).json({ status: "Job position fetched", jobPosition });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "Error fetching job position", error: error.message });
  }
});

// Add a new job position
router.route("/").post(async (req, res) => {
  const { title, basicSalary, overTimePay } = req.body;

  try {
    const newJobPosition = new JobPositionModel({
      title,
      basicSalary,
      overTimePay: overTimePay || 0,
    });

    await newJobPosition.save();
    res.json({ status: "Job position added", jobPosition: newJobPosition });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "Error adding job position", error: error.message });
  }
});

// Update a job position by ID
router.route("/:id").put(async (req, res) => {
  const jobPositionId = req.params.id;
  const { title, basicSalary, standardAllowance } = req.body;

  try {
    const updatedJobPosition = {
      title,
      basicSalary,
      standardAllowance: standardAllowance || 0,
    };

    const jobPosition = await JobPositionModel.findByIdAndUpdate(jobPositionId, updatedJobPosition, {
      new: true,
    });
    res.status(200).json({ status: "Job position updated", jobPosition });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "Error updating job position", error: err.message });
  }
});

// Delete a job position by ID
router.route("/:id").delete(async (req, res) => {
  const jobPositionId = req.params.id;
  try {
    await JobPositionModel.findByIdAndDelete(jobPositionId);
    res.status(200).json({ status: "Job position deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "Error deleting job position", error: err.message });
  }
});

module.exports = router;
