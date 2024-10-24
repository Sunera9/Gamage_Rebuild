const express = require('express');
const router = express.Router();
const UserModel = require("../models/User"); 
const JobPositionModel = require('../models/JobPosition');

// Get all users
router.route("/get").get(async (req, res) => {
  try {
    const users = await UserModel.find();
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

// Route to register a new user
router.post("/register", async (req, res) => {
  const { nic, name, email, address, phone, dob, gender } = req.body;

  try {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Default values for the fields not provided during registration
    const defaultJobCategory = "Full-time";
    const defaultDepartment = "Other";
    const defaultCompany = "None";
    const defaultStartDate = new Date();
    const defaultEndDate = null;
    const defaultJobPosition = null;

    // Create new user with default values for missing fields
    const newUser = new UserModel({
      nic,
      name,
      email,
      address,
      phone,
      dob,
      gender,
      jobPosition: defaultJobPosition,
      jobCategory: defaultJobCategory,
      department: defaultDepartment,
      company: defaultCompany,
      startDate: defaultStartDate,
      endDate: defaultEndDate
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully", newUser });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error with registering user", error: error.message });
  }
});

// Route to update a user by their ID
router.put("/:id", async (req, res) => {
  const userId = req.params.id;
  const {
    nic, name, email, address, phone, dob, gender, jobPosition, jobCategory,
    department, company, startDate, endDate
  } = req.body;

  try {
    // Find the user by ID
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update only the provided fields
    user.nic = nic || user.nic;
    user.name = name || user.name;
    user.email = email || user.email;
    user.address = address || user.address;
    user.phone = phone || user.phone;
    user.dob = dob || user.dob;
    user.gender = gender || user.gender;
    user.jobPosition = jobPosition || user.jobPosition; // Ensure valid JobPosition ID if provided
    user.jobCategory = jobCategory || user.jobCategory;
    user.department = department || user.department;
    user.company = company || user.company;
    user.startDate = startDate || user.startDate;
    user.endDate = endDate || user.endDate;

    // Save the updated user to the database
    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error with updating user", error: error.message });
  }
});

module.exports = router;