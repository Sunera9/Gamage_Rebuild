const router = require ("express") .Router();
const Admin = require ("../models/adminModel");
const  bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// Admin registration

router.post("/register", async (req, res) => {
  try {
    // check if admin already exists
    const adminExists = await Admin.findOne({ email: req.body.email });
    if (adminExists) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    // create a new admin
    const newAdmin = new Admin(req.body);
    await newAdmin.save();

    return res
      .status(201)
      .send({ message: "Admin registered successfully", success: true });
  } catch (error) {
    return res
      .status(500)
      .send({
        message: "Registration failed",
        success: false,
        error: error.message,
      });
  }
});


