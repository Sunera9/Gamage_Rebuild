const express = require('express');
const router =  express.Router();
const ProgramModel = require("../models/Program");

// Get all programs
router.route("/get").get(async (req, res) => {
    try {
      const programs = await ProgramModel.find();
      res.json(programs);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ status: "Error with fetching programs", error: err.message });
    }
  });

// Get a program by ID
router.route("/get/:id").get(async (req, res) => {
    const id = req.params.id;
    try {
      const user = await ProgramModel.findById(id);
      if (!program) {
        return res.status(404).json({ status: "Program not found" });
      }
      res.status(200).json({ status: "Program fetched", user });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ status: "Error with getting Program", error: error.message });
    }
  });
  
// Add a new user
router.route("/add").post(async (req, res) => {
    const {
        pid,
        fname,
        position,
        sdate,
        edate
    } = req.body;
  
    try {
      const newProgram = new ProgramModel({
        pid,
        fname,
        position,
        sdate,
        edate
      });
  
      await newProgram.save();
      res.json({ status: "Program Added", program: newProgram });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "Error with adding program", error: error.message });
    }
  });
  
// Delete a program by ID
router.route("/delete/:id").delete(async (req, res) => {
    const PID = req.params.id;
    try {
      await ProgramModel.findByIdAndDelete(PID);
      res.status(200).json({ status: "Program deleted" });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ status: "Error with deleting program", error: err.message });
    }
  });

// Update a program by ID
router.route("/update/:id").put(async (req, res) => {
    const PID = req.params.id;
    const {
        pid,
        fname,
        position,
        sdate,
        edate
    } = req.body;
  
    try {
      const updatedProgram = {
        pid,
        fname,
        position,
        sdate,
        edate
      };
  
      const user = await ProgramModel.findByIdAndUpdate(PID, updatedProgram, {
        new: true
      });
      res.status(200).json({ status: "Program updated", user });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ status: "Error with updating program", error: err.message });
    }
  }); 

  module.exports = router;