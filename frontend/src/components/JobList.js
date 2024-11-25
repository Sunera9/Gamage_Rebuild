import React, { useEffect, useState } from "react";
import axios from "axios";
import './JobList.css'

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch jobs from the backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:8070/api/jobs");
        setJobs(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load jobs. Please try again.");
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Handle Apply button click
  const handleApply = (jobId) => {
    alert(`You applied for job ID: ${jobId}`);
    // You can expand this function to handle actual application logic.
  };

  return (
    <div className="job-list-container">
      <h1>Available Jobs</h1>
      {loading && <p>Loading jobs...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && jobs.length === 0 && <p>No jobs available.</p>}
      {!loading && jobs.length > 0 && (
        <div className="job-cards">
          {jobs.map((job) => (
            <div key={job._id} className="job-card">
              <h2>{job.jobTitle}</h2>
              <p><strong>Company:</strong> {job.companyName}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Description:</strong> {job.jobDescription}</p>
              <p><strong>Requirements:</strong> {job.requirements.join(", ")}</p>
              <p><strong>Type:</strong> {job.jobType}</p>
              <button onClick={() => handleApply(job._id)}>Apply</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
