const mongoose = require("mongoose");

const jobPositionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    basicSalary: {
        type: Number,
        required: true,
    },
    overTimePay: {
        type: Number,
        default: 0,
    },
});

const JobPositionModel = mongoose.model("JobPosition", jobPositionSchema);
module.exports = JobPositionModel;
