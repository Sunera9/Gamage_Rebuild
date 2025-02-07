const express = require('express');
const router = express.Router();
const SettingModel = require('../models/Setting');

// CREATE a new setting
router.post('/', async (req, res) => {
    const { name, value, description } = req.body;
    
    try {
        const newSetting = new SettingModel({ name, value, description });
        const savedSetting = await newSetting.save();
        res.status(201).json({
            message: 'Setting created successfully.',
            setting: savedSetting
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to create setting.',
            error: error.message
        });
    }
});

// READ all settings
router.get('/', async (req, res) => {
    try {
        const settings = await SettingModel.find();
        res.status(200).json({
            message: 'Settings retrieved successfully.',
            settings: settings
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve settings.',
            error: error.message
        });
    }
});

// READ a single setting by ID
router.get('/:id', async (req, res) => {
    try {
        const setting = await SettingModel.findById(req.params.id);
        if (!setting) {
            return res.status(404).json({ message: 'Setting not found.' });
        }
        res.status(200).json(setting);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve setting.',
            error: error.message
        });
    }
});

// Update multiple settings using their names
router.put("/update-by-name", async (req, res) => {
    const {
        healthInsurance,
        professionalTax,
        standardAllowance,
        medicalAllowance,
        dearnessAllowance,
        conveyanceAllowance,
        epfEmployee,
        epfEmployer,
        etfEmployer
    } = req.body;

    // Mapping names to corresponding request body fields
    const updateData = [
        { name: "Health Insurance Deduction", value: healthInsurance },
        { name: "Professional Tax", value: professionalTax },
        { name: "Standard Allowance", value: standardAllowance },
        { name: "Medical Allowance", value: medicalAllowance },
        { name: "Dearness Allowance", value: dearnessAllowance },
        { name: "Conveyance Allowance", value: conveyanceAllowance },
        { name: "EPF Employee", value: epfEmployee },
        { name: "EPF Employer", value: epfEmployer },
        { name: "ETF Employer", value: etfEmployer }
    ];

    try {
        const updatePromises = updateData.map(async (item) => {
            if (item.value !== undefined) {
                return SettingModel.findOneAndUpdate(
                    { name: item.name }, // Find by name
                    { value: item.value }, // Update the value
                    { new: true, runValidators: true } // Return updated document
                );
            }
        });

        const updatedSettings = await Promise.all(updatePromises);
        res.status(200).json({
            message: "Settings updated successfully.",
            settings: updatedSettings.filter(setting => setting !== null) // Remove null values
        });

    } catch (error) {
        console.error("Error updating settings:", error.message);
        res.status(500).json({ message: "Failed to update settings.", error: error.message });
    }
});

// UPDATE a setting by ID
router.put('/:id', async (req, res) => {
    const { name, value, description } = req.body;

    try {
        const updatedSetting = await SettingModel.findByIdAndUpdate(
            req.params.id,
            { name, value, description },
            { new: true, runValidators: true }
        );
        if (!updatedSetting) {
            return res.status(404).json({ message: 'Setting not found.' });
        }
        res.status(200).json({
            message: 'Setting updated successfully.',
            setting: updatedSetting
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update setting.',
            error: error.message
        });
    }
});

// DELETE a setting by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedSetting = await SettingModel.findByIdAndDelete(req.params.id);
        if (!deletedSetting) {
            return res.status(404).json({ message: 'Setting not found.' });
        }
        res.status(200).json({
            message: 'Setting deleted successfully.',
            setting: deletedSetting
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to delete setting.',
            error: error.message
        });
    }
});

module.exports = router;