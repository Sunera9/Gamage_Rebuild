const express = require("express");
const router = express.Router();
const UserModel = require("../models/User");
const AttendanceModel = require("../models/Attendance");

// Mark Entry
router.post("/entry", async (req, res) => {
  const { userId } = req.query;
  const now = new Date();
  const today = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const time = now.toTimeString().split(" ")[0]; // HH:mm:ss

  try {
    const user = await UserModel.findById(userId);

    if (!user || user.role !== "employee") {
      return res
        .status(403)
        .json({ message: "Attendance is only applicable to employees." });
    }

    let attendance = await AttendanceModel.findOne({
      user: userId,
      date: today,
    });

    if (!attendance) {
      // Automatically create an absent record if not present
      attendance = await AttendanceModel.create({
        user: userId,
        date: today,
        entryTime: time,
        status: "Present",
      });
    } else if (attendance.entryTime) {
      return res.status(400).json({ message: "Entry time already marked." });
    } else {
      attendance.entryTime = time;
      attendance.status = "Present";
      await attendance.save();
    }

    res
      .status(200)
      .json({ message: "Entry time marked successfully.", attendance });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
});

// Mark Exit
router.post("/exit", async (req, res) => {
  const { userId } = req.query;
  const now = new Date();
  const today = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const time = now.toTimeString().split(" ")[0]; // HH:mm:ss

  try {
    const user = await UserModel.findById(userId);

    if (!user || user.role !== "employee") {
      return res
        .status(403)
        .json({ message: "Attendance is only applicable to employees." });
    }

    let attendance = await AttendanceModel.findOne({
      user: userId,
      date: today,
    });

    if (!attendance || !attendance.entryTime) {
      return res
        .status(404)
        .json({ message: "Attendance record or entry time not found." });
    }

    if (attendance.exitTime) {
      return res.status(400).json({ message: "Exit time already marked." });
    }

    // Parse times
    const entry = new Date(`1970-01-01T${attendance.entryTime}`);
    const exit = new Date(`1970-01-01T${time}`);

    if (isNaN(entry.getTime()) || isNaN(exit.getTime())) {
      return res.status(500).json({
        message: "Invalid time detected. Please check entry or current time.",
      });
    }

    // Calculate work hours
    const workHours = Math.floor((exit - entry) / (1000 * 60 * 60)); // Convert ms to hours
    const standardWorkHours = 8;

    attendance.exitTime = time;
    attendance.workHours = workHours > 0 ? workHours : 0; // Ensure non-negative

    // Calculate overtime hours (if any)
    const overtimeHours = workHours > standardWorkHours ? workHours - standardWorkHours : 0;

    // Save overtime hours in the attendance record
    attendance.overtimeHours = overtimeHours;

    await attendance.save();

    res
      .status(200)
      .json({ message: "Exit time marked successfully.", attendance });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
});

// Admin Manual Update (Restricted to employees)
router.put("/admin-update", async (req, res) => {
  const { userId, date, status, remarks } = req.body;

  try {
    const user = await UserModel.findById(userId);

    if (!user || user.role !== "employee") {
      return res
        .status(403)
        .json({ message: "Attendance is only applicable to employees." });
    }

    const attendance = await AttendanceModel.findOne({ user: userId, date });

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found." });
    }

    attendance.status = status || attendance.status;
    attendance.remarks = remarks || attendance.remarks;

    await attendance.save();

    res
      .status(200)
      .json({ message: "Attendance updated successfully.", attendance });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
});

// Fetch attendance records for a specific user for a given year and month
router.get("/records", async (req, res) => {
  const { userId, year, month } = req.query;

  try {
    if (!userId || !year || !month) {
      return res
        .status(400)
        .json({ message: "Please provide userId, year, and month." });
    }

    const startDate = new Date(year, month - 1, 1); // Start of the month
    const endDate = new Date(year, month, 0); // End of the month

    const attendanceRecords = await AttendanceModel.find({
      user: userId,
      date: { $gte: startDate.toISOString(), $lte: endDate.toISOString() },
    }).lean();

    if (!attendanceRecords.length) {
      return res
        .status(404)
        .json({
          message: "No attendance records found for the given criteria.",
        });
    }

    // Calculate working days, attended days, leave days, holidays, and absent days
    const totalDays = attendanceRecords.length;
    const holidays = attendanceRecords.filter(
      (record) => record.status === "Holiday"
    ).length;
    const workingDays = totalDays - holidays; // Days excluding holidays
    const attendedDays = attendanceRecords.filter(
      (record) => record.status === "Present"
    ).length;
    const leavesTaken = attendanceRecords.filter(
      (record) => record.status === "Leave"
    ).length;
    const absentDays = workingDays - attendedDays - leavesTaken;

    res.status(200).json({
      message: "Attendance records retrieved successfully.",
      attendanceRecords,
      summary: {
        totalDays,
        holidays,
        workingDays,
        attendedDays,
        leavesTaken,
        absentDays,
      },
    });
  } catch (error) {
    console.error("Error fetching attendance records:", error.message);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});

// Mark a specific date as a holiday for all employees
router.post("/mark-holiday", async (req, res) => {
  const { date } = req.body; // The date to mark as holiday (YYYY-MM-DD)

  try {
    // Validate the date input
    if (!date) {
      return res.status(400).json({ message: "Please provide a date." });
    }

    // Parse the date to ensure it's valid
    const holidayDate = new Date(date);
    if (isNaN(holidayDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format." });
    }

    // Get all employees (filter by role "employee")
    const employees = await UserModel.find({ role: "employee" });

    if (!employees || employees.length === 0) {
      return res.status(404).json({ message: "No employees found." });
    }

    // Loop through each employee and update their attendance status to "Holiday"
    for (const employee of employees) {
      // Check if an attendance record already exists for this employee on the given date
      let attendance = await AttendanceModel.findOne({
        user: employee._id,
        date: holidayDate,
      });

      if (!attendance) {
        // If no attendance record exists, create one with status "Holiday"
        await AttendanceModel.create({
          user: employee._id,
          date: holidayDate,
          status: "Holiday",
        });
      } else {
        // If attendance record exists, just update the status to "Holiday"
        attendance.status = "Holiday";
        await attendance.save();
      }
    }

    res
      .status(200)
      .json({ message: "Holiday marked successfully for all employees." });
  } catch (error) {
    console.error("Error marking holiday:", error.message);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});

// Mark a user's attendance as "Leave" for a specific date
router.post("/mark-leave", async (req, res) => {
  const { userId, date } = req.body; // User ID and the date to mark as leave (YYYY-MM-DD)

  try {
    // Validate the inputs
    if (!userId || !date) {
      return res
        .status(400)
        .json({ message: "Please provide both userId and date." });
    }

    // Parse the date to ensure it's valid
    const leaveDate = new Date(date);
    if (isNaN(leaveDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format." });
    }

    // Check if the user exists and is an employee
    const user = await UserModel.findById(userId);
    if (!user || user.role !== "employee") {
      return res
        .status(404)
        .json({ message: "User not found or not an employee." });
    }

    // Check if an attendance record already exists for this user on the given date
    let attendance = await AttendanceModel.findOne({
      user: userId,
      date: leaveDate,
    });

    if (!attendance) {
      // If no attendance record exists, create one with status "Leave"
      attendance = await AttendanceModel.create({
        user: userId,
        date: leaveDate,
        status: "Leave",
      });
    } else {
      // If attendance record exists, update the status to "Leave"
      attendance.status = "Leave";
      await attendance.save();
    }

    res.status(200).json({ message: "Leave marked successfully.", attendance });
  } catch (error) {
    console.error("Error marking leave:", error.message);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});

module.exports = router;
