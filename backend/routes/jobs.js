const express = require("express");
const router = express.Router();
const JobModel = require("../models/Job");  // Assuming your model is in models/Job.js

// Route to POST a new job
router.post("/jobs", async (req, res) => {
  try {
    const { jobTitle, companyName, location, jobDescription, requirements, jobType } = req.body;

    const newJob = new JobModel({
      jobTitle,
      companyName,
      location,
      jobDescription,
      requirements,
      jobType
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to GET all jobs
router.get("/jobs", async (req, res) => {
  try {
    const jobs = await JobModel.find();
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to GET a specific job by ID
router.get("/jobs/:id", async (req, res) => {
  try {
    const job = await JobModel.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to UPDATE a job by ID
router.put("/jobs/:id", async (req, res) => {
  try {
    const updatedJob = await JobModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }  // Return the updated job
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(updatedJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to DELETE a job by ID
router.delete("/jobs/:id", async (req, res) => {
  try {
    const deletedJob = await JobModel.findByIdAndDelete(req.params.id);

    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
