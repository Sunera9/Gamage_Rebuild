const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  entryTime: {
    type: String,
    default: null,
  },
  exitTime: {
    type: String,
    default: null,
  },
  workHours: {
    type: Number,
    default: 0,
  },
  overtimeHours: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["Present", "Absent", "Leave","Holiday"],
    default: "Absent",
  },
  remarks: {
    type: String,
    default: "", // Admin can add comments or notes
  },
}, { timestamps: true });

attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
