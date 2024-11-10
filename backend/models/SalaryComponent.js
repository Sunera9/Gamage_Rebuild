const mongoose = require("mongoose");

const salaryComponentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  // Separate allowance types
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
  // Separate deduction types
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
}, { timestamps: true });

const SalaryComponentModel = mongoose.model("SalaryComponent", salaryComponentSchema);

module.exports = SalaryComponentModel;
