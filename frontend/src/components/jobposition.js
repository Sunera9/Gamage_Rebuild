import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/jobpositions.css";

const JobPositions = () => {
  const [title, setTitle] = useState("");
  const [basicSalary, setBasicSalary] = useState("");
  const [overTimePay, setOvertimePay] = useState("");
  const [jobPositions, setJobPositions] = useState([]);

  const fetchJobPositions = async () => {
    try {
      const response = await axios.get("http://localhost:8070/jobPosition/");
      setJobPositions(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const newJob = { title, basicSalary, overTimePay };
      await axios.post("http://localhost:8070/jobPosition", newJob);
      fetchJobPositions(); // Refresh the list
      setTitle("");
      setBasicSalary("");
      setOvertimePay("");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobPositions();
  }, []);

  return (
    <div className="jb-container">
      <h2 className="jb-heading">Job Positions</h2>
      <form className="jb-form" onSubmit={handleSave}>
        <div className="jb-form-group">
          <label className="jb-label">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="jb-input"
            required
          />
        </div>
        <div className="jb-form-group">
          <label className="jb-label">Basic Salary</label>
          <input
            type="number"
            value={basicSalary}
            onChange={(e) => setBasicSalary(e.target.value)}
            className="jb-input"
            required
          />
        </div>
        <div className="jb-form-group">
          <label className="jb-label">Overtime Pay</label>
          <input
            type="number"
            value={overTimePay}
            onChange={(e) => setOvertimePay(e.target.value)}
            className="jb-input"
          />
        </div>
        <button className="jb-button" type="submit">
          Save
        </button>
      </form>
      <table className="jb-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Basic Salary</th>
            <th>Overtime Pay</th>
          </tr>
        </thead>
        <tbody>
          {jobPositions.map((job, index) => (
            <tr key={index}>
              <td>{job.title}</td>
              <td>{job.basicSalary}</td>
              <td>{job.overTimePay}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobPositions;
