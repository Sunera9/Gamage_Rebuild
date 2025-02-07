const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  nic: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  gender: {
    type: String,
    required: true,
  },

  dob: {
    type: Date, // Changed to Date type for better handling of birthdates
    required: true,
  },

  jobPosition: {
    type: String,
    required: true,
  },

  company: {
    type: String,
    required: true,
  },

  startDate: {
    type: Date,
    required: true,
  },

  endDate: {
    type: Date,
    required: true,
  },
});

const ApplicationModel = mongoose.model("applications", ApplicationSchema);
module.exports = ApplicationModel;
