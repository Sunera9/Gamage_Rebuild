const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
require("dotenv").config();

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
app.use('/users', userRouter);

//Tickets
const ticketRouter = require('./routes/tickets');
app.use('/tickets',ticketRouter);

//Leaves
const leaveRouter = require('./routes/leave');
app.use('/leaves',leaveRouter);


const programRouter = require('./routes/programs');
app.use('/programs',programRouter);


app.listen(PORT, () => {
    console.log(`Server is up and running on port number: ${PORT}`);
});
