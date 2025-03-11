const express = require('express');
const router = express.Router();
const ApplicationForm = require('../models/applicationForm');

// **CREATE**: Add a new application
router.post('/', async (req, res) => {
  try {
    const applicationForm = new ApplicationForm(req.body);
    const savedApplication = await applicationForm.save();
    res.status(201).json(savedApplication);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// **READ**: Get all applications
router.get('/', async (req, res) => {
  try {
    const applications = await ApplicationForm.find();
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// **READ**: Get a single application by ID
router.get('/:id', async (req, res) => {
  try {
    const application = await ApplicationForm.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.status(200).json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// **UPDATE**: Update an application by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedApplication = await ApplicationForm.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedApplication) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.status(200).json(updatedApplication);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// **DELETE**: Delete an application by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedApplication = await ApplicationForm.findByIdAndDelete(req.params.id);
    if (!deletedApplication) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get total application count
router.get("/count", async (req, res) => {
  try {
    const count = await ApplicationForm.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error("Error fetching applications count:", err.message);
    res.status(500).json({ status: "Error fetching applications count", error: err.message });
  }
});

module.exports = router;
