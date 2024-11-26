import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/manageLeave.css";

function LeavesTable() {
  const [leaves, setLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null); // Track selected leave
  const [showModal, setShowModal] = useState(false); // Control modal visibility

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await axios.get("http://localhost:8070/leaves/get");
      setLeaves(response.data || []); // Ensure leaves is an array
    } catch (error) {
      console.error("Error fetching leaves:", error);
      setLeaves([]); // Set leaves to an empty array if there's an error
    }
  };

  const handleIdClick = (leave) => {
    setSelectedLeave(leave); // Set selected leave details
    setShowModal(true); // Show the modal
  };

  const handleApprove = async () => {
    try {
      await axios.put(
        `http://localhost:8070/leaveemail/accept/${selectedLeave._id}`,
        { adminApproval: "Approved" }
      );
      setShowModal(false); // Close the modal
      alert("Leave approved successfully");
      fetchLeaves(); // Refresh leaves data
    } catch (error) {
      console.error("Error approving leave:", error);
      alert("Error approving leave");
    }
  };

  const handleReject = async () => {
    try {
      await axios.put(
        `http://localhost:8070/leaveemail/reject/${selectedLeave._id}`,
        { adminApproval: "Rejected" }
      );
      setShowModal(false); // Close the modal
      alert("Leave rejected successfully");
      fetchLeaves(); // Refresh leaves data
    } catch (error) {
      console.error("Error rejecting leave:", error);
      alert("Error rejecting leave");
    }
  };


  return (
    <div className="leaves-table">
      <div className="title">
        <h2>Leave Applications</h2>
      </div>

      <table className="leaves-table">
        <thead>
          <tr>
            <th>User name</th>
            <th>User Email</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Leave Type</th>
            <th>Duration</th>
            <th>Admin Approval</th>
            <th>Supervisor Approval</th>
          </tr>
        </thead>
        <tbody>
          {leaves.length > 0 ? (
            leaves.map((leave) => (
              <tr key={leave._id}>
                <td
                  onClick={() => handleIdClick(leave)}
                  style={{
                    cursor: "pointer",
                    color: "blue",
                    textDecoration: "underline",
                  }}
                >
                  {leave.User?.name || "N/A"}
                </td>
                <td>{leave.User?.email || "N/A"}</td>
                <td>{leave.startDate}</td>
                <td>{leave.endDate}</td>
                <td>{leave.type}</td>
                <td>{leave.duration}</td>
                <td>{leave.adminApproval}</td>
                <td>{leave.supervisorApproval}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No leaves available</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for viewing leave details */}
      {showModal && selectedLeave && (
        <div className="modal">
          <div className="modal-content">
            <h3>Leave Details</h3>
            <p>
              <strong>User ID:</strong> {selectedLeave._id}
            </p>
            <p>
              <strong>Start Date:</strong> {selectedLeave.startDate}
            </p>
            <p>
              <strong>End Date:</strong> {selectedLeave.endDate}
            </p>
            <p>
              <strong>Leave Type:</strong> {selectedLeave.type}
            </p>
            <p>
              <strong>Duration:</strong> {selectedLeave.duration}
            </p>
            <p>
              <strong>Admin Approval:</strong> {selectedLeave.adminApproval}
            </p>
            <p>
              <strong>Supervisor Approval:</strong>{" "}
              {selectedLeave.supervisorApproval}
            </p>
            <div className="modal-actions">
              <button onClick={handleApprove}>Approve</button>
              <button onClick={handleReject}>Reject</button>
              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeavesTable;
