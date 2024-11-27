const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    
    jobDescription: {
      type: String,
      required: true,
    },
    requirements: {
      type: [String], 
      required: true,
    },
    jobType: {
      type: String, 
      required: true,
    }
  }
);

const JobModel = mongoose.model("Job", JobSchema);
module.exports = JobModel;
