const express = require('express');
const router = express.Router();
const SalaryComponentModel = require("../models/SalaryComponent");
const JobPositionModel = require("../models/JobPosition");

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
          model: JobPositionModel,
          select: 'title basicSalary standardAllowance',
        },
      })
      // Filter out users whose jobPosition is null
      .lean() // Use lean() to improve performance
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Filter out salary components where jobPosition is null
    const filteredSalaryComponents = salaryComponents.filter(
      (salaryComponent) => salaryComponent.user.jobPosition !== null
    );

    // Map salary details for the sheet
    const salarySheet = filteredSalaryComponents.map((salaryComponent, index) => {
      const { user, allowances, deductions, bonuses, overtimeHours, epfEmployee, epfEmployer, etfEmployer } = salaryComponent;

      const basicSalary = user.jobPosition.basicSalary;
      const standardAllowance = user.jobPosition.standardAllowance;
      const overtimePay = overtimeHours * 100;

      const totalAllowancesAmount = allowances + standardAllowance;
      const netSalary = basicSalary + totalAllowancesAmount + bonuses + overtimePay - deductions - epfEmployee;

      return {
        srNo: (page - 1) * limit + index + 1,
        userName: user.name,
        jobTitle: user.jobPosition.title,
        basicSalary: basicSalary,
        totalAllowances: totalAllowancesAmount,
        bonuses: bonuses,
        overtimeHours: overtimeHours,
        deductions: deductions,
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

module.exports = router;

