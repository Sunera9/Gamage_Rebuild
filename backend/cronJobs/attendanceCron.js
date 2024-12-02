const cron = require("node-cron");
const Attendance = require("../models/Attendance");
const User = require("../models/User");

//every weekday at 11.59 pm this checks who haven't marked attendance and mark it as Absent
cron.schedule("59 23 * * 1-5", async () => {
  console.log("Cron job triggered: Marking absences...");
  try {
    const today = new Date().toISOString().split("T")[0];
    const employees = await User.find({ role: "employee" });

    for (const employee of employees) {
      const existingRecord = await Attendance.findOne({
        user: employee._id,
        date: today,
      });

      if (!existingRecord) {
        await Attendance.create({
          user: employee._id,
          date: today,
          status: "Absent",
          entryTime: null,
          exitTime: null,
          workHours: 0,
        });
        console.log(`Marked Absent for User ID: ${employee._id}`);
      }
    }
    console.log("Attendance marking completed.");
  } catch (error) {
    console.error("Error during attendance marking:", error);
  }
});