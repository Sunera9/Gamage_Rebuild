import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/manageLeave.css"; // You can remove this if it's not being used
import Header from "../section/Header";

function LeavesTable() {
  const [leaves, setLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null); // Track selected leave
  const [showModal, setShowModal] = useState(false); // Control modal visibility

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Fetch leaves from the backend
  const fetchLeaves = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/leaves/get`
      );
      setLeaves(response.data || []); // Ensure leaves is an array
    } catch (error) {
      console.error("Error fetching leaves:", error);
      setLeaves([]); // Set leaves to an empty array if there's an error
    }
  };

  // Handle leave item click
  const handleIdClick = (leave) => {
    setSelectedLeave(leave); // Set selected leave details
    setShowModal(true); // Show the modal
  };

  // Handle approve action
  const handleApprove = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/leaveemail/accept/${selectedLeave._id}`,
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

  // Handle reject action
  const handleReject = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/leaveemail/reject/${selectedLeave._id}`,
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
    <>
      <Header />
      <div className="container mx-auto p-6">
        <div className="text-2xl font-bold mb-4">
          <h2>Leave Applications</h2>
        </div>

        <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left bg-gray-100">User name</th>
              <th className="py-2 px-4 text-left bg-gray-100">User Email</th>
              <th className="py-2 px-4 text-left bg-gray-100">Start Date</th>
              <th className="py-2 px-4 text-left bg-gray-100">End Date</th>
              <th className="py-2 px-4 text-left bg-gray-100">Leave Type</th>
              <th className="py-2 px-4 text-left bg-gray-100">Duration</th>
              <th className="py-2 px-4 text-left bg-gray-100">
                Admin Approval
              </th>
              <th className="py-2 px-4 text-left bg-gray-100">
                Supervisor Approval
              </th>
            </tr>
          </thead>
          <tbody>
            {leaves.length > 0 ? (
              leaves.map((leave) => (
                <tr key={leave._id} className="border-b hover:bg-gray-50">
                  <td
                    onClick={() => handleIdClick(leave)}
                    className="py-2 px-4 text-blue-600 cursor-pointer underline"
                  >
                    {leave.User?.name || "N/A"}
                  </td>
                  <td className="py-2 px-4">{leave.User?.name || "N/A"}</td>
                  <td className="py-2 px-4">{leave.startDate}</td>
                  <td className="py-2 px-4">{leave.endDate}</td>
                  <td className="py-2 px-4">{leave.type}</td>
                  <td className="py-2 px-4">{leave.duration}</td>
                  <td className="py-2 px-4">{leave.adminApproval}</td>
                  <td className="py-2 px-4">{leave.supervisorApproval}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-2 px-4 text-center">
                  No leaves available
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Modal for viewing leave details */}
        {showModal && selectedLeave && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <h3 className="text-xl font-bold mb-4">Leave Details</h3>
              <p className="mb-2">
                <strong>User ID:</strong> {selectedLeave._id}
              </p>
              <p className="mb-2">
                <strong>Start Date:</strong> {selectedLeave.startDate}
              </p>
              <p className="mb-2">
                <strong>End Date:</strong> {selectedLeave.endDate}
              </p>
              <p className="mb-2">
                <strong>Leave Type:</strong> {selectedLeave.type}
              </p>
              <p className="mb-2">
                <strong>Duration:</strong> {selectedLeave.duration}
              </p>
              <p className="mb-2">
                <strong>Admin Approval:</strong> {selectedLeave.adminApproval}
              </p>
              <p className="mb-2">
                <strong>Supervisor Approval:</strong>{" "}
                {selectedLeave.supervisorApproval}
              </p>
              <div className="modal-actions flex justify-end gap-4 mt-4">
                <button
                  onClick={handleApprove}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={handleReject}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Reject
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default LeavesTable;
