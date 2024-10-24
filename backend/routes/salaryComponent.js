const express = require('express');
const router = express.Router();
const SalaryComponent = require('../models/SalaryComponent');
const UserModel = require("../models/User");

// Add Salary Component
router.post("/", async (req, res) => {
    const { userId, month, year, overtimeHours, bonuses, allowances, deductions } = req.body;

    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ status: "User not found" });
        }

        // Calculate the gross salary
        const baseSalary = user.baseSalary || 0;  // Assuming base salary is in the user model
        const grossSalary = baseSalary + (overtimeHours || 0) + (bonuses || 0) + (allowances || 0);

        // EPF and ETF calculations
        const epfEmployee = grossSalary * 0.08;  // 8% from the employee
        const epfEmployer = grossSalary * 0.12;  // 12% from the employer
        const etfEmployer = grossSalary * 0.03;  // 3% from the employer

        // Create and save the salary component
        const salaryComponent = new SalaryComponent({
            user: userId,
            month,
            year,
            overtimeHours: overtimeHours || 0,
            bonuses: bonuses || 0,
            allowances: allowances || 0,
            deductions: deductions || 0,
            epfEmployee,
            epfEmployer,
            etfEmployer
        });

        await salaryComponent.save();
        res.status(201).json({ status: "Salary component added successfully", salaryComponent });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ status: "Error with adding salary component", error: error.message });
    }
});


// Get Salary Component by User and Period
router.get("/:userId/:month/:year", async (req, res) => {
    const { userId, month, year } = req.params;

    try {
        const salaryComponent = await SalaryComponent.findOne({ user: userId, month: month, year: year });
        if (!salaryComponent) {
            return res.status(404).json({ status: "Salary component not found" });
        }
        res.status(200).json({ 
            status: "Salary component fetched", 
            salaryComponent, 
            epfEmployee: salaryComponent.epfEmployee,
            epfEmployer: salaryComponent.epfEmployer,
            etfEmployer: salaryComponent.etfEmployer
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ status: "Error with fetching salary component", error: error.message });
    }
});


// Update Salary Component
router.put("/:userId/:month/:year", async (req, res) => {
    const { userId, month, year } = req.params;
    const { overtimeHours, bonuses, allowances, deductions } = req.body;

    try {
        const salaryComponent = await SalaryComponent.findOne({ user: userId, month, year });
        if (!salaryComponent) {
            return res.status(404).json({ status: "Salary component not found" });
        }

        salaryComponent.overtimeHours = overtimeHours !== undefined ? overtimeHours : salaryComponent.overtimeHours;
        salaryComponent.bonuses = bonuses !== undefined ? bonuses : salaryComponent.bonuses;
        salaryComponent.allowances = allowances !== undefined ? allowances : salaryComponent.allowances;
        salaryComponent.deductions = deductions !== undefined ? deductions : salaryComponent.deductions;

        await salaryComponent.save();
        res.status(200).json({ status: "Salary component updated", salaryComponent });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ status: "Error with updating salary component", error: error.message });
    }
});

// Delete Salary Component
router.delete("/:userId/:month/:year", async (req, res) => {
    const { userId, month, year } = req.params;

    try {
        const salaryComponent = await SalaryComponent.findOneAndDelete({ user: userId, month, year });
        if (!salaryComponent) {
            return res.status(404).json({ status: "Salary component not found" });
        }

        res.status(200).json({ status: "Salary component deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ status: "Error with deleting salary component", error: error.message });
    }
});

module.exports = router;
