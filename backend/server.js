const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
require("dotenv").config();
const leaveRoutes = require("./routes/adminLeave");

const PORT = process.env.PORT || 8070;


const adminRoute = require("./routes/adminRoute");



app.use("/api/admin",adminRoute);




app.use(cors());
app.use(bodyParser.json());

const URL = process.env.MONGODB_URL;

mongoose.connect(URL);

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB connection successful");
});



//Users
const userRouter = require('./routes/users'); 
const jobPositionRouter = require('./routes/jobPosition');
const salaryComponentRouter = require('./routes/salaryComponent');
const salaryRouter = require('./routes/salary');
const settingRouter = require('./routes/setting');
const profileRouter = require('./routes/profile');
app.use('/users', userRouter);
app.use('/jobPosition', jobPositionRouter);
app.use('/salaryComponent', salaryComponentRouter);
app.use('/salary', salaryRouter);
app.use('/setting', settingRouter);
app.use('/profile', profileRouter);


//Tickets
const ticketRouter = require('./routes/tickets');
app.use('/tickets',ticketRouter);

//Leaves
const leaveRouter = require('./routes/leave');
app.use('/leaves',leaveRouter);

app.use("/tickets", leaveRoutes);


const programRouter = require('./routes/programs');
app.use('/programs',programRouter);


app.listen(PORT, () => {
    console.log(`Server is up and running on port number: ${PORT}`);
});
