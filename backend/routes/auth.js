const express = require("express");
const router = express.Router();
const UserModel = require("../models/User"); 
const ProfileModel = require("../models/Profile"); 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Secret key for JWT token generation (store this in an env variable for security)
const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey"; 

// Registration Route
router.post("/register", async (req, res) => {
  const {
    nic,
    name,
    email,
    address,
    phone,
    dob,
    gender,
    password,
    role
  } = req.body;

  if (!nic || !name || !email || !address || !phone || !dob || !gender || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Validate role
    const validRoles = ["visitor", "employee", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role provided" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Default values for fields not provided during registration
    const defaultJobCategory = "Full-time";
    const defaultDepartment = "Other";
    const defaultCompany = "None";
    const defaultStartDate = new Date();
    const defaultEndDate = null;
    const defaultJobPosition = null;
    const defaultBankName = "None";
    const defaultBankAccountNumber = "None";

    // Create new user with hashed password and default values for missing fields
    const newUser = new UserModel({
      nic,
      name,
      email,
      address,
      phone,
      dob,
      gender,
      password: hashedPassword,
      jobPosition: defaultJobPosition,
      jobCategory: defaultJobCategory,
      department: defaultDepartment,
      company: defaultCompany,
      startDate: defaultStartDate,
      endDate: defaultEndDate,
      bankAccountNumber: defaultBankAccountNumber,
      bankName: defaultBankName,
      role, // role passed from the request
    });

    await newUser.save();

    // Create a profile linked to the newly created user
    const newProfile = new ProfileModel({
      user: newUser._id,
      aboutMe: "",
      facebookLink: "NONE",
      linkedInLink: "NONE",
      instagramLink: "NONE",
    });

    // Save profile to DB
    await newProfile.save();

    res.status(201).json({
      message: "Registration successful. User and profile created.",
      newUser,
      newProfile,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error with registering user", error: error.message });
  }
});

// const token = jwt.sign(
//   { id: user._id, email: user.email, name: user.name }, // Include email in the token payload
//   process.env.JWT_SECRET,
//   { expiresIn: '1d' }
// );

// Login Route
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // Role validation
      if (user.role !== role) {
        return res.status(400).json({ message: "Role mismatch. You cannot log in with this role." });
      }

      // Generate a JWT token
      const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
      res.status(200).json({ message: "Login success", token, role: user.role });
    } else {
      res.status(400).json({ message: "Wrong credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;