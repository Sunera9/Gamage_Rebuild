const express = require("express");
const router = express.Router();
const User = require("../models/User"); 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Secret key for JWT token generation (make sure to store it securely)
const JWT_SECRET = "yourSecretKey"; // Change this to a more secure key

// Registration Route
router.post("/register", async (req, res) => {
  console.log("Request Body:", req.body);

  const { nic, name, email, address, phone, dob, gender, password } = req.body;
  if (!nic || !name || !email || !address || !phone || !dob || !gender || !password) {
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

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
      res.status(200).json({ message: "Login success", token, user });
    } else {
      res.status(400).json({ message: "Wrong credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
