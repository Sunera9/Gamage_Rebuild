const mongoose = require('mongoose');


const ApplicationFormSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userNIC: {
    type: String,
    required: false,
  },
  userEmail: {
    type: String,
    required: false,
  },
  contactNumber: {
    type: String,
    required: false,
  },
  userAddress: {
    type: String,
    required: false,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: false,
  },
  jobName: {
    type: String,
    required: false,
  },
  coverLetter: {
    type: String,
  },
  resume: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ApplicationForm', ApplicationFormSchema);

