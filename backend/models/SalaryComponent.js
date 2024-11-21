const mongoose = require("mongoose");

const salaryComponentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    overtimeHours: {
      type: Number,
      default: 0,
    },
    bonuses: {
      type: Number,
      default: 0,
    },
    // Allowance fields
    standardAllowance: {
      type: Number,
      default: 0,
    },
    medicalAllowance: {
      type: Number,
      default: 0,
    },
    dearnessAllowance: {
      type: Number,
      default: 0,
    },
    conveyanceAllowance: {
      type: Number,
      default: 0,
    },
    // Deduction fields
    epfEmployee: {
      type: Number,
      default: 0,
    },
    epfEmployer: {
      type: Number,
      default: 0,
    },
    etfEmployer: {
      type: Number,
      default: 0,
    },
    healthInsurance: {
      type: Number,
      default: 0,
    },
    professionalTax: {
      type: Number,
      default: 0,
    },
    // Attendance fields
    workingDays: {
      type: Number,
      required: true, // Total working days for the month
    },
    AttendedDays: {
      type: Number,
      required: true, // Total working days for the month
    },
    leavesTaken: {
      type: Number,
      default: 0, // Days employee took leave
    },
    absentDays: {
      type: Number,
      default: 0, // Days employee was absent without leave
    },
  },
  { timestamps: true }
);

const SalaryComponentModel = mongoose.model(
  "SalaryComponent",
  salaryComponentSchema
);

module.exports = SalaryComponentModel;
