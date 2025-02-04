const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const TicketModel = require("../models/Ticket");
const UserModel = require("../models/User");
const cloudinary = require("../config/cloudinaryConfig"); // Cloudinary config
const upload = require("../config/multerConfig"); // Multer config
const streamifier = require("streamifier");

// Helper function to upload file to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "tickets" },
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

// Create a new ticket with file upload
router.post("/add", upload.single("file"), async (req, res) => {
  const { userID, description, status = "in-progress", leaveType } = req.body;

  // Validate userID (check if it's a valid ObjectId and if the user exists)
  if (!mongoose.Types.ObjectId.isValid(userID)) {
    return res
      .status(400)
      .json({ status: "Error", message: "Invalid User ID" });
  }

  try {
    // Check if the user exists in the database
    const user = await UserModel.findById(userID);
    if (!user) {
      return res
        .status(404)
        .json({ status: "Error", message: "User not found" });
    }

    // Handle file upload to Cloudinary
    let fileData = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      fileData = {
        url: result.secure_url,
        public_id: result.public_id,
        fileName: req.file.originalname,
      };
    }

    // Create the new ticket
    const newTicket = new TicketModel({
      User: userID,
      description,
      status,
      leaveType,
      files: fileData,
    });

    // Save the ticket and return the result
    const savedTicket = await newTicket.save();
    res.status(201).json({ status: "Ticket Created", ticket: savedTicket });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ status: "Error", error: error.message });
  }
});



// Get all tickets
router.route("/get").get(async (req, res) => {
  try {
    const tickets = await TicketModel.find();
    res.status(200).json({ status: "Tickets fetched", tickets });
  } catch (error) {
    res
      .status(500)
      .json({ status: "Error with fetching tickets", error: error.message });
  }
});

// Get a single ticket by ID
router.route("/get/:id").get(async (req, res) => {
  try {
    const ticket = await TicketModel.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ status: "Ticket not found" });
    }
    res.status(200).json({ status: "Ticket fetched", ticket });
  } catch (error) {
    res
      .status(500)
      .json({ status: "Error with getting ticket", error: error.message });
  }
});

// Update a ticket by ID
router.route("/update/:id").put(upload.single("file"), async (req, res) => {
  const { userID, description, status, leaveType } = req.body;
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
        file: fileUrl
          ? { url: fileUrl, fileName: req.file.originalname }
          : null,
      },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ status: "Ticket not found" });
    }
    res.status(200).json({ status: "Ticket updated", ticket: updatedTicket });
  } catch (error) {
    res
      .status(500)
      .json({ status: "Error with updating ticket", error: error.message });
  }
});

// Delete a ticket by ID
router.route("/delete/:id").delete(async (req, res) => {
  try {
    const deletedTicket = await TicketModel.findByIdAndDelete(req.params.id);
    if (!deletedTicket) {
      return res.status(404).json({ status: "Ticket not found" });
    }
    res.status(200).json({ status: "Ticket deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ status: "Error with deleting ticket", error: error.message });
  }
});

// Get total ticket count
router.get("/count", async (req, res) => {
  try {
    const totalTickets = await TicketModel.countDocuments();
    res.json({ totalTickets });
  } catch (err) {
    console.error("Error fetching tickets count:", err.message);
    res.status(500).json({ status: "Error fetching tickets count", error: err.message });
  }
});




module.exports = router;
