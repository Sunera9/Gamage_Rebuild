import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/manageApplications.css"; // Optional: Include your CSS styles

function ApplicationsTable() {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null); // Track selected application
  const [showModal, setShowModal] = useState(false); // Control modal visibility

  // Fetch all applications on component mount
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/applications`
        );
        setApplications(response.data || []); // Ensure applications is an array
      } catch (error) {
        console.error("Error fetching applications:", error);
        setApplications([]); // Set to empty array on error
      }
    };

    fetchApplications();
  }, []);

  // Handle row click to view application details
  const handleRowClick = (application) => {
    setSelectedApplication(application); // Set selected application
    setShowModal(true); // Open modal
  };

  return (
    <div className="applications-table">
      <div className="title">
        <h2>Job Applications</h2>
      </div>

      <table className="applications-table">
        <thead>
          <tr>
            <th>User Name</th>
            <th>User Email</th>
            <th>Contact Number</th>
            <th>Job Name</th>
            <th>Resume</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.length > 0 ? (
            applications.map((application) => (
              <tr key={application._id}>
                <td>{application.userName || "N/A"}</td>
                <td>{application.userEmail || "N/A"}</td>
                <td>{application.contactNumber || "N/A"}</td>
                <td>{application.jobName || "N/A"}</td>
                <td>
                  <a
                    href={application.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "blue",
                      textDecoration: "underline",
                    }}
                  >
                    View Resume
                  </a>
                </td>
                <td>
                  <button
                    onClick={() => handleRowClick(application)}
                    className="view-details-button"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No applications available</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for application details */}
      {showModal && selectedApplication && (
        <div className="modal">
          <div className="modal-content">
            <h3>Application Details</h3>
            <p>
              <strong>User Name:</strong>{" "}
              {selectedApplication.userName || "N/A"}
            </p>
            <p>
              <strong>User NIC:</strong> {selectedApplication.userNIC || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {selectedApplication.userEmail || "N/A"}
            </p>
            <p>
              <strong>Contact Number:</strong>{" "}
              {selectedApplication.contactNumber || "N/A"}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {selectedApplication.userAddress || "N/A"}
            </p>
            <p>
              <strong>Job Name:</strong> {selectedApplication.jobName || "N/A"}
            </p>
            <p>
              <strong>Cover Letter:</strong>{" "}
              {selectedApplication.coverLetter || "N/A"}
            </p>
            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicationsTable;
