const mongoose = require("mongoose");

const SettingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    value: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
}, { timestamps: true });

const SettingModel = mongoose.model("Setting", SettingSchema);
module.exports = SettingModel;