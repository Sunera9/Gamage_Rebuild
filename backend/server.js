const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();

require("dotenv").config();
require("./cronJobs/attendanceCron");

const PORT = process.env.PORT || 8070;

// CORS configuration
app.use(
  cors({
    origin: [
      "https://gamage-rebuild-e918.vercel.app",
         "https://gamage-rebuild-p9ce9adut-sunera9s-projects.vercel.app",
      ],
   

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Add OPTIONS method
    credentials: true,
  })
);

app.options("*", cors());

app.use(bodyParser.json());
app.use(express.json());

const URL = process.env.MONGODB_URL;

mongoose.connect(
  "mongodb+srv://gamagerecruiters3:GamagePass@newcluster.t0vet.mongodb.net/?retryWrites=true&w=majority&appName=NewCluster"
);

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connection successful");
});

// Simple test route
app.get("/test", (req, res) => {
  res.status(200).send("Backend is working!");
});

//Backend Routes
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const jobPositionRouter = require("./routes/jobPosition");
const salaryComponentRouter = require("./routes/salaryComponent");
const salaryRouter = require("./routes/salary");
const settingRouter = require("./routes/setting");
const profileRouter = require("./routes/profile");
const attendanceRouter = require("./routes/attendance");
const applicationRouter = require("./routes/applications");
const adminRoute = require("./routes/adminRoute");
const leaveRoutes = require("./routes/adminLeave");
const ticketEmailRoute = require("./routes/ticketEmail");
const leaveEmailRoute = require("./routes/leaveEmail");
const ticketRouter = require("./routes/tickets");
const leaveRouter = require("./routes/leave");
const jobRoutes = require("./routes/jobs");
const applicationForms = require("./routes/applicationForms");

app.use("/api/admin", adminRoute);
app.use("/users", userRouter);
app.use("/jobPosition", jobPositionRouter);
app.use("/salaryComponent", salaryComponentRouter);
app.use("/salary", salaryRouter);
app.use("/setting", settingRouter);
app.use("/profile", profileRouter);
app.use("/attendance", attendanceRouter);
app.use("/auth", authRouter);

app.use("/leaveEmail", leaveEmailRoute);
app.use("/ticketEmail", ticketEmailRoute);
app.use("/tickets", ticketRouter);
app.use("/leaves", leaveRouter);
app.use("/api", jobRoutes);
app.use("/api/applications", applicationForms);

app.listen(PORT, () => {
  console.log(`Server is up and running on port number: ${PORT}`);
});
