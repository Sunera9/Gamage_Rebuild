const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    nic: {
      type: String,
      required: false,
    },

    name: {
      type: String,
      required: false,
    },

    email: {
      type: String,
      required: false,
    },

    address: {
      type: String,
      required: false,
    },

    phone: {
      type: String,
      required: false,
    },

    dob: {
      type: Date,
      required: false,
    },

    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: false,
    },
    password: {
      type: String,
      required: false,
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
      required: false,
    },
    bankAccountNumber: {
      type: String,
      required: false,
    },
    bankName: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["visitor", "admin", "employee"],
      required: false,
      default: "visitor",
    },
  },
  { timestamps: false }
);

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
