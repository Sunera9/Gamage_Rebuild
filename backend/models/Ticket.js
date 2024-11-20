const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  userID: { 
    type: String,
  },
  description: { 
    type: String,
    required: true,
  },
  status: { 
    type: String,
    enum: ['open', 'in-progress', 'Rejected', 'Approved'],
    default: 'open',
  },
  leaveType: {
    type: String,
    enum: ['Personal', 'Educational', 'Medical'],
    required: true,
  },
  files: {
    url: { // Cloudinary file URL
      type: String,
      required: false,
    },
    public_id: { // Cloudinary public ID for file management
      type: String,
      required: false,
    },
    fileName: { // Original file name (optional)
      type: String,
      required: false,
    },
  },
  fileType: {
    type: String,
  },
  createdAt: { 
    type: Date, 
    default: new Date(),
  },
});

const TicketModel = mongoose.model("Ticket", TicketSchema)
module.exports = TicketModel