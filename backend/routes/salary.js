const express = require('express');
const router = express.Router();
const SalaryComponentModel = require("../models/SalaryComponent");
const mongoose = require("mongoose");
const UserModel = require("../models/User");
const SettingModel = require("../models/Setting");
const AttendanceModel = require("../models/Attendance");

// Route to search salary records by month, year, and either userId or userName
router.route("/search").get(async (req, res) => {
  const { month, year, userQuery } = req.query;

  try {
    // Check if both month and year are provided
    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required." });
    }

    // Prepare search criteria for month and year in the salary components
    const searchCriteria = { month, year };

    // Check if the userQuery matches a unique userId or may be a userName
    let userMatch = null;
    if (userQuery) {
      // First, try finding by userId
      if (mongoose.Types.ObjectId.isValid(userQuery)) {
        userMatch = await UserModel.findById(userQuery).select('_id');
      }
      
      // If userMatch is still null, search by userName, which could return multiple results
      if (!userMatch) {
        const usersByName = await UserModel.find({ name: userQuery }).select('_id');
        if (usersByName.length === 0) {
          return res.status(404).json({ message: "No user found with the specified ID or name." });
        }
        searchCriteria.user = { $in: usersByName.map(user => user._id) };
      } else {
        searchCriteria.user = userMatch._id;
      }
    }

    // Fetch salary components based on the constructed search criteria
    const salaryComponents = await SalaryComponentModel.find(searchCriteria)
      .populate({
        path: 'user',
        select: 'name jobPosition',
        populate: {
          path: 'jobPosition',
          select: 'title basicSalary overTimePay',
        },
      })
      .lean();

    // If no salary records are found
    if (salaryComponents.length === 0) {
      return res.status(404).json({ message: "No salary records found for the specified criteria." });
    }

    // Map salary details for each result
    const salaryRecords = salaryComponents.map((salaryComponent, index) => {
      const {
        user,
        overtimeHours,
        bonuses,
        medicalAllowance,
        dearnessAllowance,
        conveyanceAllowance,
        epfEmployee,
        epfEmployer,
        etfEmployer,
        healthInsurance,
        professionalTax
      } = salaryComponent;

      const basicSalary = user.jobPosition.basicSalary;
      const overTimePay = user.jobPosition.overTimePay || 0;

      const totalAllowances =
        (medicalAllowance || 0) +
        (dearnessAllowance || 0) +
        (conveyanceAllowance || 0);

      const totalDeductions =
        (epfEmployee || 0) +
        (healthInsurance || 0) +
        (professionalTax || 0);

      const overtimeEarnings = overtimeHours * overTimePay;
      const netSalary = basicSalary + totalAllowances + bonuses + overtimeEarnings - totalDeductions;

      return {
        srNo: index + 1,
        userName: user.name,
        jobTitle: user.jobPosition.title,
        basicSalary: basicSalary,
        totalAllowances: totalAllowances,
        bonuses: bonuses,
        overtimeHours: overtimeHours,
        overtimeEarnings: overtimeEarnings,
        totalDeductions: totalDeductions,
        epfEmployee: epfEmployee,
        epfEmployer: epfEmployer,
        etfEmployer: etfEmployer,
        netSalary: netSalary,
      };
    });

    res.status(200).json({
      message: "Salary records found.",
      salaryRecords,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Failed to search salary records",
      error: error.message,
    });
  }
});

router.route("/sheet").get(async (req, res) => {
  try {
    // Extract month and year from the query parameters
    let { month, year } = req.query;

    // Get the current month and year as fallback defaults
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed in JavaScript
    const currentYear = currentDate.getFullYear();

    // Validate and fallback to current month and year
    month = parseInt(month, 10) || currentMonth;
    year = parseInt(year, 10) || currentYear;

    // Ensure the month is in the correct range (1-12)
    if (month < 1 || month > 12) {
      return res.status(400).json({ message: "Invalid month provided." });
    }

    // Check if the requested month and year match the current month and year
    const isCurrentMonth = month === currentMonth && year === currentYear;

    // Calculate the date range for the query
    const startDate = new Date(year, month - 1, 1); // First day of the month
    const endDate = new Date(year, month, 0); // Last day of the month

    // Validate the generated dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Failed to construct valid date range for attendance query.");
    }

    // Fetch all settings for allowances and deductions
    const settings = await SettingModel.find();
    const settingsMap = settings.reduce((map, setting) => {
      map[setting.name] = setting.value;
      return map;
    }, {});

    // Fetch all users with the role "employee"
    const employees = await UserModel.find({ role: "employee" })
      .populate("jobPosition")
      .lean();

    // Fetch attendance for all employees for the given month and year
    const attendanceRecords = await AttendanceModel.find({
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    }).lean();

    // Organize attendance data by user
    const attendanceMap = {};
    attendanceRecords.forEach((record) => {
      const userId = record.user.toString();
      if (!attendanceMap[userId]) {
        attendanceMap[userId] = {
          totalPresent: 0,
          totalLeaves: 0,
          totalAbsent: 0,
        };
      }

      if (record.status === "Present") {
        attendanceMap[userId].totalPresent++;
      } else if (record.status === "Leave") {
        attendanceMap[userId].totalLeaves++;
      } else if (record.status === "Absent") {
        attendanceMap[userId].totalAbsent++;
      }
    });

    // Calculate total working days in the month (excluding weekends)
    const totalDaysInMonth = new Date(year, month, 0).getDate();
    let workingDays = 0;

    for (let day = 1; day <= totalDaysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      // Check if the day is a weekend (Saturday or Sunday)
      if (date.getDay() !== 0 && date.getDay() !== 6) { // Skip Sundays (0) and Saturdays (6)
        workingDays++;
      }
    }

    // Prepare bulk operations for SalaryComponent updates (only for the current month)
    const bulkOps = employees.map((employee) => {
      const { _id: userId, jobPosition } = employee;

      if (!jobPosition) return null; // Skip employees without job positions

      const { basicSalary = 0, overTimePay = 0 } = jobPosition;
      const attendance = attendanceMap[userId.toString()] || {
        totalPresent: 0,
        totalLeaves: 0,
        totalAbsent: 0, // Default to 0 if no attendance records found
      };

      // Calculate allowances
      const medicalAllowance = settingsMap["Medical Allowance"] || 0;
      const dearnessAllowance = settingsMap["Dearness Allowance"] || 0;
      const conveyanceAllowance = settingsMap["Conveyance Allowance"] || 0;
      const totalAllowances = medicalAllowance + dearnessAllowance + conveyanceAllowance;

      // Calculate deductions
      const epfEmployee = basicSalary * (settingsMap["EPF Employee"] / 100 || 0);
      const epfEmployer = basicSalary * (settingsMap["EPF Employer"] / 100 || 0);
      const etfEmployer = basicSalary * (settingsMap["ETF Employer"] / 100 || 0);
      const healthInsurance = settingsMap["Health Insurance Deduction"] || 0;
      const professionalTax = settingsMap["Professional Tax"] || 0;
      const totalDeductions = epfEmployee + healthInsurance + professionalTax;

      // Calculate bonuses, overtime earnings, and net salary
      const bonuses = 0; // Adjust as needed
      const overtimeHours = attendanceMap[userId]?.overtimeHours || 0;
      const overtimeEarnings = overtimeHours * overTimePay;
      const grossSalary = basicSalary + totalAllowances + bonuses + overtimeEarnings;
      const netSalary = grossSalary - totalDeductions;

      // If it's the current month, update the salary component
      if (isCurrentMonth) {
        return {
          updateOne: {
            filter: { user: userId, month, year },
            update: {
              user: userId,
              month,
              year,
              workingDays, // Updated to exclude weekends
              AttendedDays: attendance.totalPresent + attendance.totalLeaves, // Add leaves to attended days
              leavesTaken: attendance.totalLeaves,
              absentDays: attendance.totalAbsent, // This should count only "Absent" status, not weekends
              overtimeHours,
              bonuses,
              medicalAllowance,
              dearnessAllowance,
              conveyanceAllowance,
              epfEmployee,
              epfEmployer,
              etfEmployer,
              healthInsurance,
              professionalTax,
            },
            upsert: true,
          },
        };
      } else {
        // For previous months, don't update, just return null
        return null;
      }
    }).filter((op) => op !== null); // Remove null entries for previous months

    // Execute bulk operations for the current month only
    if (bulkOps.length > 0) {
      await SalaryComponentModel.bulkWrite(bulkOps);
    }

    // Fetch the salary components (both current and previous months)
    const salaryComponents = await SalaryComponentModel.find({ month, year })
      .populate({
        path: "user",
        select: "name jobPosition",
        populate: {
          path: "jobPosition",
          select: "title basicSalary overTimePay",
        },
      })
      .lean();

    // Generate salary sheet
    const salarySheet = salaryComponents.map((component, index) => {
      const {
        user,
        workingDays,
        AttendedDays,
        leavesTaken,
        absentDays,
        overtimeHours,
        bonuses,
        medicalAllowance,
        dearnessAllowance,
        conveyanceAllowance,
        epfEmployee,
        epfEmployer,
        etfEmployer,
        healthInsurance,
        professionalTax,
      } = component;

      const basicSalary = user.jobPosition.basicSalary;
      const overTimePay = user.jobPosition.overTimePay || 0;
      const overtimeEarnings = overtimeHours * overTimePay;

      const totalAllowances =
        (medicalAllowance || 0) +
        (dearnessAllowance || 0) +
        (conveyanceAllowance || 0);

      const totalDeductions =
        (epfEmployee || 0) +
        (healthInsurance || 0) +
        (professionalTax || 0);

      const netSalary = basicSalary + totalAllowances + bonuses + overtimeEarnings - totalDeductions;

      return {
        srNo: index + 1,
        userName: user.name,
        jobTitle: user.jobPosition.title,
        basicSalary,
        workingDays,
        AttendedDays,
        leavesTaken,
        absentDays,
        totalAllowances,
        bonuses,
        overtimeHours,
        overtimeEarnings,
        totalDeductions,
        epfEmployee,
        epfEmployer,
        etfEmployer,
        netSalary,
      };
    });

    res.status(200).json({
      message: "Salary sheet generated successfully.",
      salarySheet,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Failed to generate salary sheet",
      error: error.message,
    });
  }
});

// Generate salary slip for a specific employee based on salary component ID
router.route("/slip/:salaryComponentId").get(async (req, res) => {
  const { salaryComponentId } = req.params;

  try {
    // Fetch salary component data for the specified ID
    const salaryComponent = await SalaryComponentModel.findById(salaryComponentId)
      .populate({
        path: 'user',
        select: 'name jobPosition bankAccountNumber bankName department company',
        populate: {
          path: 'jobPosition',
          select: 'title basicSalary overTimePay',
        },
      })
      .lean();

    if (!salaryComponent) {
      return res.status(404).json({ message: "Salary component not found" });
    }

    // Extract data from salary component
    const {
      user,
      month,
      year,
      bonuses,
      medicalAllowance,
      dearnessAllowance,
      conveyanceAllowance,
      epfEmployee,
      epfEmployer,
      etfEmployer,
      healthInsurance,
      professionalTax,
      overtimeHours,
    } = salaryComponent;

    // Ensure user and job position exist
    if (!user || !user.jobPosition) {
      return res.status(400).json({ message: "User or job position data is missing" });
    }

    const { basicSalary, overTimePay } = user.jobPosition;

    // Fetch attendance data for the user and the specified month/year
    const attendanceData = await AttendanceModel.find({
      user: user._id,
      month,
      year,
    }).lean();

    // Calculate working days
    const totalDaysInMonth = new Date(year, month, 0).getDate(); // Days in the month
    const weekends = Array.from({ length: totalDaysInMonth }, (_, i) => new Date(year, month - 1, i + 1))
      .filter(date => date.getDay() === 0 || date.getDay() === 6).length;
    const workingDays = totalDaysInMonth - weekends;

    // Group attendance data by status
    const attendedDays = attendanceData.filter(record => record.status === "Present").length;
    const leavesTaken = attendanceData.filter(record => record.status === "Leave").length;
    const absentDays = workingDays - attendedDays - leavesTaken;

    // Calculate earnings
    const overtimeEarnings = overtimeHours * (overTimePay || 0);
    const earnings = [
      { name: "Basic Salary", amount: basicSalary },
      { name: "Overtime Pay", amount: overtimeEarnings },
      { name: "Bonuses", amount: bonuses || 0 },
      { name: "Medical Allowance", amount: medicalAllowance || 0 },
      { name: "Dearness Allowance", amount: dearnessAllowance || 0 },
      { name: "Conveyance Allowance", amount: conveyanceAllowance || 0 },
    ];

    // Calculate deductions
    const deductions = [
      { name: "EPF (Employee)", amount: epfEmployee || 0 },
      { name: "Health Insurance", amount: healthInsurance || 0 },
      { name: "Professional Tax", amount: professionalTax || 0 },
    ];

    // Calculate totals
    const totalEarnings = earnings.reduce((sum, earning) => sum + earning.amount, 0);
    const totalDeductions = deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
    const netSalary = totalEarnings - totalDeductions;

    // Prepare the salary slip
    const salarySlip = {
      employee: {
        name: user.name,
        designation: user.jobPosition.title,
        department: user.department,
        company: user.company || "N/A",
        bankAccountNumber: user.bankAccountNumber,
        bankName: user.bankName,
      },
      period: {
        month,
        year,
      },
      attendance: {
        workingDays,
        attendedDays,
        leavesTaken,
        absentDays,
      },
      earnings,
      totalEarnings,
      deductions,
      totalDeductions,
      netSalary,
      employerContributions: {
        epfEmployer,
        etfEmployer,
      },
    };

    // Send response
    res.status(200).json({
      message: "Salary slip generated successfully",
      salarySlip,
    });

  } catch (error) {
    console.error("Error generating salary slip:", error.message);
    res.status(500).json({
      message: "Failed to generate salary slip",
      error: error.message,
    });
  }
});


module.exports = router;


