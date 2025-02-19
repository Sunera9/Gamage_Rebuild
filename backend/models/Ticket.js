const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Ensure this matches the UserModel name
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "in-progress", "Rejected", "Approved"],
    default: "open",
  },
  leaveType: {
    type: String,
    enum: ["Personal", "Educational", "Medical"],
    required: true,
  },
  files: {
    fileName: String,
    filePath: String,
    fileType: String,
    fileSize: Number,
  },
  fileType: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const TicketModel = mongoose.model("Ticket", TicketSchema);
module.exports = TicketModel;
