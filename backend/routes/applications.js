const express = require('express');
const router = express.Router();
const ApplicationModel = require("../models/Application");  // Updated model reference

// Get all applications
router.route("/get").get(async (req, res) => {
  try {
    // Selecting only specific fields
    const applications = await ApplicationModel.find({}, 'name email nic phone gender dob jobPosition company startDate endDate');
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "Error with fetching applications", error: err.message });
  }
});

// Get an application by ID
router.route("/get/:id").get(async (req, res) => {
  const id = req.params.id;
  try {
    const application = await ApplicationModel.findById(id, 'name email nic phone gender dob jobPosition company startDate endDate');
    if (!application) {
      return res.status(404).json({ status: "Application not found" });
    }
    res.status(200).json({ status: "Application fetched", application });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "Error with getting application", error: error.message });
  }
});

// Add a new application
router.route("/add").post(async (req, res) => {
  const {
    nic,
    name,
    email,
    phone,
    gender,
    dob,
    jobPosition,
    company,
    startDate,
    endDate
  } = req.body;

  try {
    const newApplication = new ApplicationModel({
      nic,
      name,
      email,
      phone,
      gender,
      dob,
      jobPosition,
      company,
      startDate,
      endDate
    });

    await newApplication.save();
    res.json({ status: "Application Added", application: newApplication });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "Error with adding application", error: error.message });
  }
});

// Delete an application by ID
router.route("/delete/:id").delete(async (req, res) => {
  const applicationId = req.params.id;
  try {
    await ApplicationModel.findByIdAndDelete(applicationId);
    res.status(200).json({ status: "Application deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "Error with deleting application", error: err.message });
  }
});

// Get total application count
router.get("/count", async (req, res) => {
  try {
    const totalApplications = await ApplicationModel.countDocuments();
    res.json({ totalApplications });
  } catch (err) {
    console.error("Error fetching applications count:", err.message);
    res.status(500).json({ status: "Error fetching applications count", error: err.message });
  }
});

// Update an application by ID
router.route("/update/:id").put(async (req, res) => {
  const applicationId = req.params.id;
  const {
    nic,
    name,
    email,
    phone,
    gender,
    dob,
    jobPosition,
    company,
    startDate,
    endDate
  } = req.body;

  try {
    const updatedApplication = {
      nic,
      name,
      email,
      phone,
      gender,
      dob,
      jobPosition,
      company,
      startDate,
      endDate
    };

    const application = await ApplicationModel.findByIdAndUpdate(applicationId, updatedApplication, { new: true });
    res.status(200).json({ status: "Application updated", application });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "Error with updating application", error: err.message });
  }
});

// Get the total count of applications
router.route("/count").get(async (req, res) => {
  try {
    const count = await ApplicationModel.countDocuments();
    res.status(200).json({ status: "Total applications count", count });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "Error with counting applications", error: err.message });
  }
});

module.exports = router;
