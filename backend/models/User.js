const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
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
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    jobPosition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPosition",
      required: false,
    },
    jobCategory: {
      type: String,
      required: false,
      enum: [
        "Full-time",
        "Part-time",
        "Contract",
        "Internship",
        "Remote",
        "Other",
      ],
      default: "Full-time",
    },
    department: {
      type: String,
      required: false,
      enum: ["HR", "Finance", "IT", "Sales", "Marketing", "Other"],
      default: "Other",
    },
    company: {
      type: String,
      required: false,
    },
    startDate: {
      type: Date,
      required: false,
    },
    endDate: {
      type: Date,
      required:false,
    },
    bankAccountNumber: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["visitor", "admin", "employee"],
      required: true,
      default: "visitor",
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
