const express = require("express");
const router = express.Router();
const UserModel = require("../models/User"); 
const bcrypt = require("bcryptjs");
const ProfileModel=require("../models/Profile");
const jwt = require("jsonwebtoken");

// Secret key for JWT token generation (make sure to store it securely)
const JWT_SECRET = "yourSecretKey"; // Change this to a more secure key

// Registration Route
// router.post("/register", async (req, res) => {
//   console.log("Request Body:", req.body);

//   const { nic, name, email, address, phone, dob, gender, password } = req.body;
//   if (!nic || !name || !email || !address || !phone || !dob || !gender || !password) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   try {
//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create new user
//     const newUser = new User({
//       nic,
//       name,
//       email,
//       address,
//       phone,
//       dob,
//       gender,
//       password: hashedPassword,
//     });

//     // Save new user to DB
//     await newUser.save();
//     res.status(201).json({ message: "Registration successful", newUser });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error });
//   }
// });

// Registration Route
router.post("/register", async (req, res) => {
  console.log("Request Body:", req.body);

  const {
    nic,
    name,
    email,
    address,
    phone,
    dob,
    gender,
    password,
  } = req.body;

  if (!nic || !name || !email || !address || !phone || !dob || !gender || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
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
    const defaultRole = "visitor";

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
      role: defaultRole,
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


// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
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
