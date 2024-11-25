const express = require('express');
const router = express.Router();
const UserModel = require("../models/User"); 

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

// Add a new user
router.route("/add").post(async (req, res) => {
  const {
    nic,
    name,
    email,
    address,
    phone,
    dob,
    gender,
    role
  } = req.body;

  try {
    const newUser = new UserModel({
      nic,
      name,
      email,
      address,
      phone,
      dob,
      gender,
      role
    });

    await newUser.save();
    res.json({ status: "User Added", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "Error with adding user", error: error.message });
  }
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
  const {
    nic,
    name,
    email,
    address,
    phone,
    dob,
    gender,
    role
  } = req.body;

  try {
    const updatedUser = {
      nic,
      name,
      email,
      address,
      phone,
      dob,
      gender,
      role
    };

    const user = await UserModel.findByIdAndUpdate(userId, updatedUser, {
      new: true
    });
    res.status(200).json({ status: "User updated", user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "Error with updating user", error: err.message });
  }
});

module.exports = router;