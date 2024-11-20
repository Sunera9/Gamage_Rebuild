const express = require('express');
const router = express.Router();
const TicketModel = require('../models/Ticket');
const cloudinary = require('../config/cloudinaryConfig'); // Import Cloudinary config
const upload = require('../config/multerConfig'); // Import Multer config
const streamifier = require('streamifier');

// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer, mimeType, fileName) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: 'tickets',
      public_id: fileName,
    };

    // If the file is a PDF, set the resource type to 'raw'
    if (mimeType === 'application/pdf') {
      uploadOptions.resource_type = 'raw';
    }

    const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
      
    });
    

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });

  
};

// Create a ticket with file upload
router.route('/add').post(upload.single('file'), async (req, res) => {
  const { userID, description, status = 'in-progress', leaveType } = req.body;

  try {
    let fileData = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype, req.file.originalname);
      fileData = {
        url: result.secure_url,
        public_id: result.public_id,
        fileName: req.file.originalname,
        fileType: req.file.mimetype, // Save mimetype (e.g., application/pdf, image/png)
      };
    }

    const newTicket = new TicketModel({
      userID,
      description,
      status,
      leaveType,
      files: fileData,
    });

    const savedTicket = await newTicket.save();
    res.status(201).json({ status: 'Ticket Created', ticket: savedTicket });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ status: 'Error with creating ticket', error: error.message });
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
  let fileData = null;

  try {
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype, req.file.originalname);
      fileData = {
        url: result.secure_url,
        public_id: result.public_id,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
      };
    }

    const updatedTicket = await TicketModel.findByIdAndUpdate(
      req.params.id,
      {
        userID,
        description,
        status,
        leaveType,
        files: fileData || undefined, // Only update if new file is uploaded
      },
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
