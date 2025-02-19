const express = require("express");
const router = express.Router();
const SalaryComponentModel = require("../models/SalaryComponent");
const mongoose = require("mongoose");
const UserModel = require("../models/User");
const SettingModel = require("../models/Setting");
const AttendanceModel = require("../models/Attendance");

// Route to search salary records by month, year, and either userId or userName
router.route("/search").get(async (req, res) => {
  const { month, year, userId } = req.query;

  try {
    // Validate required parameters
    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required." });
    }

    // Initialize search criteria
    const searchCriteria = { month, year };

    if (userId) {
      // Check if userId is a valid ObjectId
      if (mongoose.Types.ObjectId.isValid(userId)) {
        const userById = await UserModel.findById(userId).select("_id");
        if (userById) searchCriteria.user = userById._id;
      } else {
        // Otherwise, search by name
        const usersByName = await UserModel.find({ name: userId }).select(
          "_id"
        );
        if (usersByName.length > 0) {
          searchCriteria.user = { $in: usersByName.map((user) => user._id) };
        } else {
          return res
            .status(404)
            .json({ message: "No user found with the specified ID or name." });
        }
      }
    }

    // Fetch salary components based on criteria
    const salaryComponents = await SalaryComponentModel.find(searchCriteria)
      .populate({
        path: "user",
        select: "name jobPosition",
        populate: {
          path: "jobPosition",
          select: "title basicSalary overTimePay",
        },
      })
      .lean();

    if (salaryComponents.length === 0) {
      return res.status(404).json({
        message: "No salary records found for the specified criteria.",
      });
    }

    // Map and calculate salary details
    const salaryRecords = salaryComponents.map((component, index) => {
      const {
        user,
        overtimeHours = 0,
        bonuses = 0,
        standardAllowance = 0,
        medicalAllowance = 0,
        dearnessAllowance = 0,
        conveyanceAllowance = 0,
        epfEmployee = 0,
        epfEmployer = 0,
        etfEmployer = 0,
        healthInsurance = 0,
        professionalTax = 0,
        workingDays = 0,
        attendedDays = 0,
        leavesTaken = 0,
      } = component;

      const basicSalary = user.jobPosition?.basicSalary || 0;
      const overTimePay = user.jobPosition?.overTimePay || 0;

      const totalAllowances =
        standardAllowance +
        medicalAllowance +
        dearnessAllowance +
        conveyanceAllowance;

      const totalDeductions = epfEmployee + healthInsurance + professionalTax;

      const overtimeEarnings = overtimeHours * overTimePay;

      const netSalary =
        basicSalary +
        totalAllowances +
        bonuses +
        overtimeEarnings -
        totalDeductions;

      return {
        srNo: index + 1,
        userName: user.name || "N/A",
        jobTitle: user.jobPosition?.title || "N/A",
        basicSalary: basicSalary,
        totalAllowances: totalAllowances,
        totalDeductions: totalDeductions,
        netSalary: netSalary,
        salaryComponentId: component._id,
      };
    });

    // Return the salary records
    res.status(200).json({
      message: "Salary records found.",
      salaryRecords,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      message: "Failed to search salary records.",
      error: error.message,
    });
  }
});

// Route to get salary sheet by month and year
router.route("/sheet").get(async (req, res) => {
  try {
    let { month, year } = req.query;

    // Get current month and year as fallback defaults
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed
    const currentYear = currentDate.getFullYear();

    // Validate and fallback to current month and year
    month = parseInt(month, 10) || currentMonth;
    year = parseInt(year, 10) || currentYear;

    // Ensure valid month range
    if (month < 1 || month > 12) {
      return res.status(400).json({ message: "Invalid month provided." });
    }

    // Check if the requested month/year matches the current
    const isCurrentMonth = month === currentMonth && year === currentYear;

    const startDate = new Date(year, month - 1, 1); // First day of the month
    const endDate = new Date(year, month, 0); // Last day of the month

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Invalid date range for the query.");
    }

    const settings = await SettingModel.find();
    const settingsMap = settings.reduce((map, setting) => {
      map[setting.name] = setting.value;
      return map;
    }, {});

    const employees = await UserModel.find({ role: "employee" })
      .populate("jobPosition")
      .lean();

    const attendanceRecords = await AttendanceModel.find({
      date: { $gte: startDate, $lt: endDate },
    }).lean();

    const attendanceMap = {};
    attendanceRecords.forEach((record) => {
      const userId = record.user.toString();
      if (!attendanceMap[userId]) {
        attendanceMap[userId] = {
          totalPresent: 0,
          totalLeaves: 0,
          totalAbsent: 0,
          totalOvertimeHours: 0, // Track overtime hours
        };
      }
      if (record.status === "Present") {
        attendanceMap[userId].totalPresent++;
        attendanceMap[userId].totalOvertimeHours += record.overtimeHours || 0; // Add overtime hours for "Present" records
      } else if (record.status === "Leave") {
        attendanceMap[userId].totalLeaves++;
      } else if (record.status === "Absent") {
        attendanceMap[userId].totalAbsent++;
      }
    });

    const totalDaysInMonth = new Date(year, month, 0).getDate();
    let workingDays = 0;
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      if (date.getDay() !== 0 && date.getDay() !== 6) workingDays++; // Only count weekdays as working days
    }

    const bulkOps = [];
    for (const employee of employees) {
      const {
        _id: userId,
        jobPosition,
        startDate: employeeStartDate,
      } = employee;
      if (!jobPosition) continue;

      // Check if the employee was recruited before the requested month/year
      const employeeStartMonth = new Date(employeeStartDate).getMonth() + 1; // Months are 0-indexed
      const employeeStartYear = new Date(employeeStartDate).getFullYear();

      if (
        employeeStartYear > year ||
        (employeeStartYear === year && employeeStartMonth > month)
      ) {
        // Skip employees who started after the requested month/year
        continue;
      }

      const { basicSalary = 0, overTimePay = 0 } = jobPosition;
      const attendance = attendanceMap[userId.toString()] || {
        totalPresent: 0,
        totalLeaves: 0,
        totalAbsent: 0,
        totalOvertimeHours: 0,
      };

      const allowances = {
        medicalAllowance: settingsMap["Medical Allowance"] || 0,
        dearnessAllowance: settingsMap["Dearness Allowance"] || 0,
        conveyanceAllowance: settingsMap["Conveyance Allowance"] || 0,
        standardAllowance: settingsMap["Standard Allowance"] || 0,
      };

      const deductions = {
        epfEmployee: basicSalary * (settingsMap["EPF Employee"] / 100 || 0),
        epfEmployer: basicSalary * (settingsMap["EPF Employer"] / 100 || 0),
        etfEmployer: basicSalary * (settingsMap["ETF Employer"] / 100 || 0),
        healthInsurance: settingsMap["Health Insurance Deduction"] || 0,
        professionalTax: settingsMap["Professional Tax"] || 0,
      };

      const totalAllowances =
        allowances.medicalAllowance +
        allowances.dearnessAllowance +
        allowances.conveyanceAllowance +
        allowances.standardAllowance;

      const totalDeductions =
        deductions.epfEmployee +
        deductions.healthInsurance +
        deductions.professionalTax;

      const bonuses = 0;
      const overtimeHours = attendance.totalOvertimeHours || 0; // Use total overtime hours
      const overtimeEarnings = overtimeHours * overTimePay;
      const grossSalary =
        basicSalary + totalAllowances + bonuses + overtimeEarnings;
      const netSalary = grossSalary - totalDeductions;

      const existingComponent = await SalaryComponentModel.findOne({
        user: userId,
        month,
        year,
      });

      if (isCurrentMonth || !existingComponent) {
        bulkOps.push({
          updateOne: {
            filter: { user: userId, month, year },
            update: {
              user: userId,
              month,
              year,
              workingDays,
              AttendedDays: attendance.totalPresent + attendance.totalLeaves,
              leavesTaken: attendance.totalLeaves,
              absentDays: attendance.totalAbsent,
              overtimeHours,
              bonuses,
              ...allowances,
              ...deductions,
            },
            upsert: true,
          },
        });
      }
    }

    if (bulkOps.length > 0) {
      await SalaryComponentModel.bulkWrite(bulkOps);
    }

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
        standardAllowance,
        epfEmployee,
        epfEmployer,
        etfEmployer,
        healthInsurance,
        professionalTax,
      } = component;

      const basicSalary = user.jobPosition.basicSalary;
      const overtimeEarnings =
        overtimeHours * (user.jobPosition.overTimePay || 0);

      const totalAllowances =
        medicalAllowance +
        dearnessAllowance +
        conveyanceAllowance +
        standardAllowance;

      const totalDeductions = epfEmployee + healthInsurance + professionalTax;

      const netSalary =
        basicSalary +
        totalAllowances +
        bonuses +
        overtimeEarnings -
        totalDeductions;

      return {
        srNo: index + 1,
        userName: user.name,
        jobTitle: user.jobPosition.title,
        basicSalary,
        totalAllowances,
        totalDeductions,
        netSalary,
        salaryComponentId: component._id,
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
    const salaryComponent = await SalaryComponentModel.findById(
      salaryComponentId
    )
      .populate({
        path: "user",
        select:
          "name jobPosition bankAccountNumber bankName department company",
        populate: {
          path: "jobPosition",
          select: "title basicSalary overTimePay",
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
      standardAllowance,
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
      return res
        .status(400)
        .json({ message: "User or job position data is missing" });
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
    const weekends = Array.from(
      { length: totalDaysInMonth },
      (_, i) => new Date(year, month - 1, i + 1)
    ).filter((date) => date.getDay() === 0 || date.getDay() === 6).length;
    const workingDays = totalDaysInMonth - weekends;

    // Group attendance data by status
    const attendedDays = attendanceData.filter(
      (record) => record.status === "Present"
    ).length;
    const leavesTaken = attendanceData.filter(
      (record) => record.status === "Leave"
    ).length;
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
      { name: "Standard Allowance", amount: standardAllowance || 0 },
    ];

    // Calculate deductions
    const deductions = [
      { name: "EPF (Employee)", amount: epfEmployee || 0 },
      { name: "Health Insurance", amount: healthInsurance || 0 },
      { name: "Professional Tax", amount: professionalTax || 0 },
    ];

    // Calculate totals
    const totalEarnings = earnings.reduce(
      (sum, earning) => sum + earning.amount,
      0
    );
    const totalDeductions = deductions.reduce(
      (sum, deduction) => sum + deduction.amount,
      0
    );
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