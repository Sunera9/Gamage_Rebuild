const express = require("express");
const router = express.Router();
const UserModel = require("../models/User");
const ProfileModel = require("../models/Profile");

// Route to create a profile for an existing user
router.post("/", async (req, res) => {
  const { userId, aboutMe, facebookLink, linkedInLink, instagramLink } = req.body;

  try {
    // Check if the user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if a profile already exists for the user
    const existingProfile = await ProfileModel.findOne({ user: userId });
    if (existingProfile) {
      return res.status(400).json({ message: "Profile already exists for this user." });
    }

    // Create the profile for the user
    const newProfile = new ProfileModel({
      user: userId,
      aboutMe,
      facebookLink: facebookLink || null,
      linkedInLink: linkedInLink || null,
      instagramLink: instagramLink || null,
    });

    await newProfile.save();

    res.status(201).json({ message: "Profile created successfully", profile: newProfile });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error creating profile", error: error.message });
  }
});

// Get profile by user ID
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user and profile
    const user = await UserModel.findById(userId).select(
      "dob address name email"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = await ProfileModel.findOne({ user: userId }).populate(
      "user",
      "name email"
    );
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Calculate age from date of birth (dob)
    const currentDate = new Date();
    const age = currentDate.getFullYear() - user.dob.getFullYear();
    const monthDiff = currentDate.getMonth() - user.dob.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && currentDate.getDate() < user.dob.getDate())
    ) {
      age--;
    }

    // Construct the profile response with age and address
    const profileData = {
      ...profile.toObject(),
      age,
      address: user.address,
    };

    res.status(200).json({ profile: profileData });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Error retrieving profile", error: error.message });
  }
});

// Update profile by user ID
router.put("/:userId", async (req, res) => {
  const { userId } = req.params;
  const { aboutMe, facebookLink, linkedInLink, instagramLink } = req.body;

  try {
    // Find profile by user ID
    const profile = await ProfileModel.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Update only allowed fields
    if (aboutMe !== undefined) profile.aboutMe = aboutMe;
    if (facebookLink !== undefined) profile.facebookLink = facebookLink;
    if (linkedInLink !== undefined) profile.linkedInLink = linkedInLink;
    if (instagramLink !== undefined) profile.instagramLink = instagramLink;

    await profile.save();

    res.status(200).json({ message: "Profile updated successfully", profile });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
});

// Delete profile by user ID
router.delete("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Find and delete the profile
    const profile = await ProfileModel.findOneAndDelete({ user: userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Error deleting profile", error: error.message });
  }
});

module.exports = router;
