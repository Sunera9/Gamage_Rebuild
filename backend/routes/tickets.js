const express = require('express');
const router = express.Router();
const TicketModel = require('../models/Ticket');
const UserModel= require('../models/User')
const cloudinary = require('../config/cloudinaryConfig'); // Import Cloudinary config
const upload = require('../config/multerConfig'); // Import Multer config
const streamifier = require('streamifier');

//authenticate 


const authenticate = async (req, res, next) => {
  try {
    const nic = req.headers["nic"]; // Replace with your actual NIC retrieval logic
    if (!nic) {
      return res
        .status(401)
        .json({ status: "Unauthorized", message: "NIC not provided" });
    }
    const user = await UserModel.findOne({ nic });
    if (!user) {
      return res
        .status(404)
        .json({ status: "Not Found", message: "User not found" });
    }
    req.user = user; // Attach the user to the request object
    next();
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};

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

// Create a ticket with file upload
router
  .route("/add")
  .post(authenticate, upload.single("file"), async (req, res) => {
    const { description, status = "in-progress", leaveType } = req.body;

    try {
      let fileData = null;

      if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        fileData = {
          url: result.secure_url,
          public_id: result.public_id,
          fileName: req.file.originalname,
        };
      }

      const { nic } = req.user; // Fetch the NIC from the authenticated user

      // Create a new ticket
      const newTicket = new TicketModel({
        nic, // Store the NIC directly in the ticket
        description,
        status,
        leaveType,
        files: fileData,
      });

      const savedTicket = await newTicket.save();
      res.status(201).json({ status: "Ticket Created", ticket: savedTicket });
    } catch (error) {
      console.error("Error creating ticket:", error);
      res
        .status(500)
        .json({ status: "Error creating ticket", message: error.message });
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
  let fileUrl = null;

  try {
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      fileUrl = result.secure_url; // Upload to Cloudinary and get URL
    }

    const updatedTicket = await TicketModel.findByIdAndUpdate(
      req.params.id,
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
