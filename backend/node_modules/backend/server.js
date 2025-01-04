const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();

require("dotenv").config();
require("./cronJobs/attendanceCron");


const PORT = process.env.PORT || 8070;



app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const URL = process.env.MONGODB_URL;

mongoose.connect(URL);

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB connection successful");
});


//Assuming protect is a middleware function that checks the user role
// const protect = (role) => {
//     return (req, res, next) => {
//       const userRole = req.user.role; // Assuming the user role is set after authentication
  
//       if (userRole !== role) {
//         return res.status(403).json({ message: "Access denied" });
//       }
  
//       next();
//     };
//   };

  //Admin Dashboard Route
  // app.get("/api/admin/dashboard", protect("admin"), (req, res) => {
  //   res.json({ message: "Welcome to the admin dashboard" });
  // });
  
  // Employee Dashboard Route
  // app.get("/api/employee/dashboard", protect("employee"), (req, res) => {
  //   res.json({ message: "Welcome to the employee dashboard" });
  // });
  
  // Visitor Page Route
  // app.get("/api/visitor/dashboard", protect("visitor"), (req, res) => {
  //   res.json({ message: "Welcome, visitor!" });
  // });

//Backend Routes 
const userRouter = require('./routes/users'); 
const authRouter = require("./routes/auth");
const jobPositionRouter = require('./routes/jobPosition');
const salaryComponentRouter = require('./routes/salaryComponent');
const salaryRouter = require('./routes/salary');
const settingRouter = require('./routes/setting');
const profileRouter = require('./routes/profile');
const attendanceRouter = require('./routes/attendance');
const applicationRouter =require('./routes/applications');
const adminRoute = require("./routes/adminRoute");
const leaveRoutes = require("./routes/adminLeave");
const ticketEmailRoute = require("./routes/ticketEmail");
const leaveEmailRoute = require("./routes/leaveEmail")
const ticketRouter = require('./routes/tickets');
const leaveRouter = require('./routes/leave');
const jobRoutes = require("./routes/jobs");
const applicationForms = require('./routes/applicationForms');

app.use("/api/admin",adminRoute);
app.use('/users', userRouter);
app.use('/jobPosition', jobPositionRouter);
app.use('/salaryComponent', salaryComponentRouter);
app.use('/api/salary', salaryRouter);
app.use('/setting', settingRouter);
app.use('/profile', profileRouter);
app.use('/attendance',attendanceRouter);
app.use("/auth", authRouter);
app.use('/api/applications',applicationRouter);
app.use("/leaveEmail", leaveEmailRoute);
app.use("/ticketEmail", ticketEmailRoute);
app.use('/tickets',ticketRouter);
app.use('/leaves',leaveRouter);
app.use("/api", jobRoutes);
app.use('/api/applications', applicationForms);


app.listen(PORT, () => {
    console.log(`Server is up and running on port number: ${PORT}`);
});
