const express = require('express');
const router = express.Router();
const TicketModel = require('../models/Ticket');
const multer = require('multer');
const path = require('path');

// Configure storage settings for Multer
const storage = multer.memoryStorage(); // Use memory storage for simplicity

// Set up Multer for handling file uploads
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png|pdf/; // Allowed file types
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .jpeg, .jpg, .png, and .pdf files are allowed!'));
    }
  }
});

// Route to create a ticket with file upload
router.post('/tickets', upload.single('file'), async (req, res) => {
  const { userID, description, status, leaveType } = req.body;

  try {
    const fileData = req.file ? {
      fileName: req.file.originalname,
      filePath: req.file.buffer, // Store the file in memory (not saved to disk)
      fileType: req.file.mimetype,
      fileSize: req.file.size,
    } : null;

    const newTicket = new TicketModel({
      userID,
      description,
      status: status || 'in-progress',
      leaveType,
      file: fileData,
    });

    const savedTicket = await newTicket.save();
    res.status(201).json(savedTicket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all tickets
router.get('/tickets', async (req, res) => {
  try {
    const tickets = await TicketModel.find();
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single ticket by ID
router.get('/tickets/:id', async (req, res) => {
  try {
    const ticket = await TicketModel.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a ticket by ID
router.put('/tickets/:id', upload.single('file'), async (req, res) => {
  try {
    const { userID, description, status, leaveType } = req.body;
    const fileData = req.file ? {
      fileName: req.file.originalname,
      filePath: req.file.buffer, // Store the file in memory (not saved to disk)
      fileType: req.file.mimetype,
      fileSize: req.file.size,
    } : null;

    const updatedTicket = await TicketModel.findByIdAndUpdate(
      req.params.id,
      {
        userID,
        description,
        status,
        leaveType,
        file: fileData,
      },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a ticket by ID
router.delete('/tickets/:id', async (req, res) => {
  try {
    const deletedTicket = await TicketModel.findByIdAndDelete(req.params.id);
    if (!deletedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
