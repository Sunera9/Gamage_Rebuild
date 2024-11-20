// auth.js (Express route for authentication)
const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Assuming user model is in user.js
const bcrypt = require("bcryptjs");

// Registration Route
router.post("/register", async (req, res) => {
  console.log("Request Body:", req.body); // Debugging log

  const { nic, name, email, address, phone, dob, gender, password } = req.body;
  if (
    !nic ||
    !name ||
    !email ||
    !address ||
    !phone ||
    !dob ||
    !gender ||
    !password
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      nic,
      name,
      email,
      address,
      phone,
      dob,
      gender,
      password: hashedPassword,
    });

    // Save new user to DB
    await newUser.save();
    res.status(201).json({ message: "Registration successful", newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      // Compare the entered password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        res.status(200).send({ message: "Login success", user });
      } else {
        res.status(400).send({ message: "Wrong credentials" });
      }
    } else {
      res.status(404).send({ message: "User not registered" });
    }
  } catch (error) {
    res.status(500).send({ message: "Server error", error });
  }
});

module.exports = router;
