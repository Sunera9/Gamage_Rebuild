const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema(
  {
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          // `this` refers to the document being validated
          return this.startDate <= value;
        },
        message: "End date must be greater than or equal to start date",
      },
    },
    type: {
      type: String,
      enum: [
        "Sick Leave",
        "Annual Leave",
        "Maternity Leave",
        "Personal Leave",
        "Common",
        "Paternity Leave",
      ],
      default: "Common",
    },
    duration: {
      type: String,
      enum: ["Half Day", "Full Day"],
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    adminApproval: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    supervisorApproval: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);



const LeaveModel = mongoose.model("Leave", LeaveSchema);
module.exports = LeaveModel

