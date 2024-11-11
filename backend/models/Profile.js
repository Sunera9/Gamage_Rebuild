const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    aboutMe: {
      type: String,
      default: "",
    },
    facebookLink: {
      type: String,
      default: "NONE",
    },
    linkedInLink: {
      type: String,
      default: "NONE",
    },
    instagramLink: {
      type: String,
      default: "NONE",
    },
  },
  { timestamps: true }
);

const ProfileModel = mongoose.model("Profile", ProfileSchema);
module.exports = ProfileModel;
