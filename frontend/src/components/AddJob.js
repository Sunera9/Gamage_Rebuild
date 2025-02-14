import React, { useState } from "react";
import axios from "axios";
import "../styles/AddJob.css";

const PostJob = () => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    location: "",
    jobDescription: "",
    requirements: "",
    jobType: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...formData,
        requirements: formData.requirements
          .split(",")
          .map((item) => item.trim()), // Convert comma-separated string to array
      };
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/jobs`,
        formattedData
      );
      setSuccessMessage("Job posted successfully!");
      setErrorMessage("");
      setFormData({
        jobTitle: "",
        companyName: "",
        location: "",
        jobDescription: "",
        requirements: "",
        jobType: "",
      });
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage("Failed to post the job. Please try again.");
    }
  };

  return (
    <div className="post-job-container">
      <h1>Post a Job</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Job Title</label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Job Description</label>
          <textarea
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div>
          <label>Requirements (comma-separated)</label>
          <input
            type="text"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Job Type</label>
          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            required
          >
            <option value="">Select Job Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
        <button type="submit">Post Job</button>
      </form>

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default PostJob;
