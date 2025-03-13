const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const ApplicationForm = require("../models/applicationForm");

// Configure storage for uploaded resumes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // Ensure uploads directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage: storage });

// **CREATE**: Add a new application with file upload
router.post("/", upload.single("resume"), async (req, res) => {
  try {
    const applicationData = {
      userName: req.body.userName,
      userNIC: req.body.userNIC,
      userEmail: req.body.userEmail,
      contactNumber: req.body.contactNumber,
      userAddress: req.body.userAddress,
      jobId: req.body.jobId,
      jobName: req.body.jobName,
      coverLetter: req.body.coverLetter,
      resume: req.file ? req.file.filename : null,
    };

    console.log("Received application data:", applicationData);

    const applicationForm = new ApplicationForm(applicationData);
    const savedApplication = await applicationForm.save();

    res.status(201).json(savedApplication);
  } catch (err) {
    console.error("Error saving application:", err);
    res.status(400).json({ error: err.message });
  }
});

// **READ**: Get all applications
router.get("/", async (req, res) => {
  try {
    const applications = await ApplicationForm.find();
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// **READ**: Get a single application by ID
router.get("/:id", async (req, res) => {
  try {
    const application = await ApplicationForm.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.status(200).json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// **UPDATE**: Update an application by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedApplication = await ApplicationForm.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedApplication) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.status(200).json(updatedApplication);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// **DELETE**: Delete an application by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedApplication = await ApplicationForm.findByIdAndDelete(
      req.params.id
    );
    if (!deletedApplication) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.status(200).json({ message: "Application deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// **DOWNLOAD RESUME**
router.get("/resume/:filename", (req, res) => {
  const filePath = path.join(__dirname, "../uploads/", req.params.filename);
  res.download(filePath);
});

module.exports = router;
