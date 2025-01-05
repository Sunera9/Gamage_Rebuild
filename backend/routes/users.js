const express = require('express');
const router = express.Router();
const UserModel = require("../models/User"); 
const ProfileModel = require("../models/Profile");



// Get all users
router.route("/get").get(async (req, res) => {
  try {
    const users = await UserModel.find().populate('jobPosition');

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "Error with fetching users", error: err.message });
  }
});

// Get a user by ID
router.route("/get/:id").get(async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ status: "User not found" });
    }
    res.status(200).json({ status: "User fetched", user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "Error with getting user", error: error.message });
  }
});

// Add a new user (this functionality is now redundant in userroute.js since it's in auth.js)
router.route("/add").post(async (req, res) => {
  res.status(400).json({ message: "User registration should be done via /register route in auth.js" });
});

// Delete a user by ID
router.route("/delete/:id").delete(async (req, res) => {
  const userId = req.params.id;
  try {
    await UserModel.findByIdAndDelete(userId);
    res.status(200).json({ status: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "Error with deleting user", error: err.message });
  }
});

// Update a user by ID
router.route("/update/:id").put(async (req, res) => {
  const userId = req.params.id;
  const { nic, name, email, address, phone, dob, gender, jobPosition, jobCategory, department, company, startDate, endDate, bankAccountNumber, bankName, role } = req.body;

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, {
      nic, name, email, address, phone, dob, gender, jobPosition, jobCategory, department, company, startDate, endDate, bankAccountNumber, bankName, role
    }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "Error with updating user", error: err.message });
  }
});


// Get user by email
router.route("/getByEmail/:email").get(async (req, res) => {
  const email = req.params.email;
  try {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ status: "User not found" });
    }
    res.status(200).json({ status: "User fetched", user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "Error with getting user", error: error.message });
  }
});

// Update a user by email
router.route("/updateByEmail/:email").put(async (req, res) => {
  const email = req.params.email;
  const { nic, name, address, phone, dob, gender, jobPosition, jobCategory, department, company, startDate, endDate, bankAccountNumber, bankName, role } = req.body;

  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { email: email },
      {
        nic,
        name,
        address,
        phone,
        dob,
        gender,
        jobPosition,
        jobCategory,
        department,
        company,
        startDate,
        endDate,
        bankAccountNumber,
        bankName,
        role,
      },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "Error with updating user", error: err.message });
  }
});




module.exports = router;
