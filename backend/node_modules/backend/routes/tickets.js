const express = require('express');
const router = express.Router();
const TicketModel = require('../models/Ticket');
const UserModel= require('../models/User')
const cloudinary = require('../config/cloudinaryConfig'); // Import Cloudinary config
const upload = require('../config/multerConfig'); // Import Multer config
const streamifier = require('streamifier');
const authMiddleware = require("../middlewares/authMiddleware");


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


// Helper function to upload file to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'tickets' }, // Specify the folder name in Cloudinary
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

//Crate a ticket with file upload 

router.post("/create-ticket", authMiddleware, async (req, res) => {
  try {
    // Extract data from the request body
    const { description, leaveType, files, fileType } = req.body;


    // Validate required fields
    if (!description || !leaveType) {
      return res.status(400).send({
        message: "Description and leaveType are required.",
        success: false,
      });

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype, req.file.originalname);
      fileData = {
        url: result.secure_url,
        public_id: result.public_id,
        fileName: req.file.originalname,
        fileType: req.file.mimetype, // Save mimetype (e.g., application/pdf, image/png)
      };
      const result = await uploadToCloudinary(req.file.buffer);
      fileData = {
        url: result.secure_url,
        public_id: result.public_id, 
        fileName: req.file.originalname,
      } // Get the URL of the uploaded file from Cloudinary

    }
    // Get user details (name and email) from the User model
    const user = await UserModel.findById(req.body.userId); // Assuming userId is passed in the request body

    if (!user) {
      return res.status(404).send({
        message: "User not found.",
        success: false,
      });
    }
    // Create the ticket
    const newTicket = new TicketModel({
      User: req.body.userId, // Set from the authMiddleware
      description,
      leaveType,
      files: files || {}, // Optional files object
      fileType: fileType || "N/A",
    });

    // Save the ticket to the database
    const savedTicket = await newTicket.save();

    // Send a success response
    res.status(201).send({
      message: "Ticket created successfully.",
      success: true,
      data: savedTicket,
      userName: user.name,
      userEmail: user.email,
    });
  } catch (error) {
    res.status(500).send({
      message: "An error occurred while creating the ticket.",
      success: false,
      error: error.message,
    });
  }
});


// Get all tickets
router.route('/get').get(async (req, res) => {
  try {
    const tickets = await TicketModel.find()
    .populate('User', 'name email');
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
  let fileUrl = null;

  try {
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      fileUrl = result.secure_url; // Upload to Cloudinary and get URL
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
      { userID, description, status, leaveType, file: fileUrl ? { url: fileUrl, fileName: req.file.originalname } : null },
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
