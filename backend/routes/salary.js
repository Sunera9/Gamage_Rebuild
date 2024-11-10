const express = require('express');
const router = express.Router();
const SalaryComponentModel = require("../models/SalaryComponent");
const mongoose = require("mongoose");
const UserModel = require("../models/User");

// Generate salary sheet for a specific month and year
router.route("/sheet").get(async (req, res) => {
  const { month, year, page = 1, limit = 20 } = req.query;

  try {
    // Fetch salary components for the specified month and year
    const salaryComponents = await SalaryComponentModel.find({ month, year })
      .populate({
        path: 'user',
        select: 'name jobPosition',
        populate: {
          path: 'jobPosition',
          select: 'title basicSalary overTimePay',
        },
      })
      .lean()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Filter out salary components where jobPosition is null
    const filteredSalaryComponents = salaryComponents.filter(
      (salaryComponent) => salaryComponent.user.jobPosition !== null
    );

    // Map salary details for the sheet
    const salarySheet = filteredSalaryComponents.map((salaryComponent, index) => {
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
      const overTimePay = user.jobPosition.overTimePay || 0; // Use overtime pay from jobPosition

      // Calculate overtime earnings
      const overtimeEarnings = overtimeHours * overTimePay;

      // Total allowances (all allowance values are stored directly in SalaryComponent)
      const totalAllowances =
        (medicalAllowance || 0) +
        (dearnessAllowance || 0) +
        (conveyanceAllowance || 0);

      // Total deductions (all deduction values are stored directly in SalaryComponent)
      const totalDeductions =
        (epfEmployee || 0) +
        (healthInsurance || 0) +
        (professionalTax || 0);

      // Calculate net salary
      const netSalary = basicSalary + totalAllowances + bonuses + overtimeEarnings - totalDeductions;

      return {
        srNo: (page - 1) * limit + index + 1,
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
      message: "Salary sheet generated successfully.",
      salarySheet,
      currentPage: page,
      totalPages: Math.ceil(filteredSalaryComponents.length / limit),
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Failed to generate salary sheet",
      error: error.message,
    });
  }
});

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


// Generate salary slip for a specific employee based on salary component ID
router.route("/slip/:salaryComponentId").get(async (req, res) => {
  const { salaryComponentId } = req.params;

  try {
    // Fetch salary component data for the specified ID
    const salaryComponent = await SalaryComponentModel.findById(salaryComponentId)
      .populate({
        path: 'user',
        select: 'name jobPosition bankAccountNumber bankName',
        populate: {
          path: 'jobPosition',
          select: 'title basicSalary overTimePay',
        },
      })
      .lean();

    if (!salaryComponent) {
      return res.status(404).json({ message: "Salary component not found" });
    }

    // Destructure required fields from populated data
    const { user, bonuses, medicalAllowance, dearnessAllowance, conveyanceAllowance,
            epfEmployee, epfEmployer, etfEmployer, healthInsurance, professionalTax, overtimeHours } = salaryComponent;
    const { basicSalary, overTimePay } = user.jobPosition;

    // Calculate earnings and deductions
    const overtimeEarnings = overtimeHours * overTimePay;
    const earnings = [
      { name: "Basic Salary", amount: basicSalary },
      { name: "Overtime Pay", amount: overtimeEarnings },
      { name: "Bonuses", amount: bonuses },
      { name: "Medical Allowance", amount: medicalAllowance },
      { name: "Dearness Allowance", amount: dearnessAllowance },
      { name: "Conveyance Allowance", amount: conveyanceAllowance },
    ];

    const deductions = [
      { name: "EPF (Employee)", amount: epfEmployee },
      { name: "Health Insurance", amount: healthInsurance },
      { name: "Professional Tax", amount: professionalTax },
    ];

    // Calculate total earnings and deductions
    const totalEarnings = earnings.reduce((sum, earning) => sum + earning.amount, 0);
    const totalDeductions = deductions.reduce((sum, deduction) => sum + deduction.amount, 0);

    // Calculate net salary
    const netSalary = totalEarnings - totalDeductions;

    // Prepare the salary slip data to send in response
    const salarySlip = {
      employee: {
        name: user.name,
        designation: user.jobPosition.title,
        bankAccountNumber: user.bankAccountNumber,
        bankName: user.bankName,
      },
      earnings,
      totalEarnings,
      deductions,
      totalDeductions,
      netSalary,
    };

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


