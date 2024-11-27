const express = require('express');
const router = express.Router();
const TicketModel = require('../models/Ticket');
const multer = require('multer');
const path = require('path');

// Configure storage settings for Multer
const storage = multer.memoryStorage();

// Set up Multer for handling file uploads
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|pdf/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error('Only .jpeg, .jpg, .png, and .pdf files are allowed!'));
    }
  }
});

// Create a ticket with file upload
router.route('/add').post(upload.single('file'), async (req, res) => {
  const { userID, description, status = 'in-progress', leaveType } = req.body;

  try {
    const fileData = req.file ? {
      fileName: req.file.originalname,
      filePath: req.file.buffer,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
    } : null;

    const newTicket = new TicketModel({
      userID,
      description,
      status,
      leaveType,
      file: fileData,
    });

    const savedTicket = await newTicket.save();
    res.status(201).json({ status: 'Ticket Created', ticket: savedTicket });
  } catch (error) {
    res.status(400).json({ status: 'Error with creating ticket', error: error.message });
  }
});

// Get all tickets
router.route('/get').get(async (req, res) => {
  try {
    const tickets = await TicketModel.find();
    res.status(200).json({ status: 'Tickets fetched', tickets });
  } catch (error) {
    res.status(500).json({ status: 'Error with fetching tickets', error: error.message });
  }
});

// Get a single ticket by ID
router.route('/get/:id').get(async (req, res) => {
  try {
    const ticket = await TicketModel.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ status: 'Ticket not found' });
    }
    res.status(200).json({ status: 'Ticket fetched', ticket });
  } catch (error) {
    res.status(500).json({ status: 'Error with getting ticket', error: error.message });
  }
});

// Update a ticket by ID
router.route('/update/:id').put(upload.single('file'), async (req, res) => {
  const { userID, description, status, leaveType } = req.body;
  const fileData = req.file ? {
    fileName: req.file.originalname,
    filePath: req.file.buffer,
    fileType: req.file.mimetype,
    fileSize: req.file.size,
  } : null;

  try {
    const updatedTicket = await TicketModel.findByIdAndUpdate(
      req.params.id,
      { userID, description, status, leaveType, file: fileData },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ status: 'Ticket not found' });
    }
    res.status(200).json({ status: 'Ticket updated', ticket: updatedTicket });
  } catch (error) {
    res.status(500).json({ status: 'Error with updating ticket', error: error.message });
  }
});

// Delete a ticket by ID
router.route('/delete/:id').delete(async (req, res) => {
  try {
    const deletedTicket = await TicketModel.findByIdAndDelete(req.params.id);
    if (!deletedTicket) {
      return res.status(404).json({ status: 'Ticket not found' });
    }
    res.status(200).json({ status: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'Error with deleting ticket', error: error.message });
  }
});

module.exports = router;
