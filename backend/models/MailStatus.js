const mongoose = require("mongoose");

const mailStatusSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
            required: true,
          },
          status: {
            type: String,
            enum: ['Sent', 'Failed', 'Pending'], 
            default: 'Pending',
          },
          sentAt: {
            type: Date,
            default: Date.now,
          },
          errorMessage: {
            type: String, 
          },
    }
);

const MailStatusModel = mongoose.model("MailStatus", mailStatusSchema);
module.exports = MailStatusModel;