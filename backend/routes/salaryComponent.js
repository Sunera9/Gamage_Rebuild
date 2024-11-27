const express = require('express');
const router = express.Router();
const SalaryComponent = require('../models/SalaryComponent');
const UserModel = require("../models/User");
const SettingModel = require("../models/Setting");


// Add Salary Component
router.post("/post", async (req, res) => {
    const { userId, month, year, overtimeHours, bonuses } = req.body;

    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ status: "User not found" });
        }

        // Fetch settings for allowances and deductions
        const settings = await SettingModel.find({ name: { $in: [
            "Health Insurance Deduction", "Professional Tax", "Standard Allowance", 
            "Medical Allowance", "Dearness Allowance", "Conveyance Allowance", 
            "EPF Employee", "EPF Employer", "ETF Employer"
        ]}});

        // Map settings to an object for easy access
        const settingsMap = settings.reduce((map, setting) => {
            map[setting.name] = setting.value;
            return map;
        }, {});

        // Calculate the gross salary
        const baseSalary = user.baseSalary || 0;  // Assuming base salary is in the user model
        const grossSalary = baseSalary + (overtimeHours || 0) + (bonuses || 0) + 
                            (settingsMap["Medical Allowance"] || 0) + 
                            (settingsMap["Dearness Allowance"] || 0) + 
                            (settingsMap["Conveyance Allowance"] || 0) +
                            (settingsMap["Standard Allowance"] || 0);

        // EPF and ETF calculations based on settings
        const epfEmployee = grossSalary * (settingsMap["EPF Employee"] / 100 || 0);
        const epfEmployer = grossSalary * (settingsMap["EPF Employer"] / 100 || 0);
        const etfEmployer = grossSalary * (settingsMap["ETF Employer"] / 100 || 0);

        // Create and save the salary component
        const salaryComponent = new SalaryComponent({
            user: userId,
            month,
            year,
            overtimeHours: overtimeHours || 0,
            bonuses: bonuses || 0,
            medicalAllowance: settingsMap["Medical Allowance"] || 0,
            dearnessAllowance: settingsMap["Dearness Allowance"] || 0,
            conveyanceAllowance: settingsMap["Conveyance Allowance"] || 0,
            epfEmployee,
            epfEmployer,
            etfEmployer,
            healthInsurance: settingsMap["Health Insurance Deduction"] || 0,
            professionalTax: settingsMap["Professional Tax"] || 0,
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
    const { overtimeHours, bonuses} = req.body;

    try {
        const salaryComponent = await SalaryComponent.findOne({ user: userId, month, year });
        if (!salaryComponent) {
            return res.status(404).json({ status: "Salary component not found" });
        }

        salaryComponent.overtimeHours = overtimeHours !== undefined ? overtimeHours : salaryComponent.overtimeHours;
        salaryComponent.bonuses = bonuses !== undefined ? bonuses : salaryComponent.bonuses;

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
