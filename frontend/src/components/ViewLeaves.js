import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../section/Header";
import Swal from "sweetalert2";

export default function ViewLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [id, setUserID] = useState("");

  useEffect(() => {
    // Fetch user ID from local storage (or authentication system)
    const userId = localStorage.getItem("userId"); // Adjust based on your auth method
    if (userId) {
      setUserID(userId);
    }
  }, []);

  useEffect(() => {
    if (id) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/leaves/get/${id}`)
        .then((response) => {
          setLeaves(response.data);
        })
        .catch((error) => {
          console.error("Error fetching leaves:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Unable to fetch leave requests. Please try again later.",
          });
        });
    }
  }, [id]);

  return (
    <>
      <Header />
      <div className="container-ticket">
        <h2 className="text-2xl font-semibold text-gray-700 my-5">
          My Leave Requests
        </h2>
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Leave ID</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Type</th>
                <th>Duration (days)</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length > 0 ? (
                leaves.map((leave) => {
                  const startDate = new Date(leave.startDate);
                  const endDate = new Date(leave.endDate);
                  const duration = Math.ceil(
                    (endDate - startDate) / (1000 * 60 * 60 * 24) + 1
                  ); // Duration calculation

                  return (
                    <tr key={leave._id}>
                      <td>{leave._id}</td>
                      <td>{startDate.toLocaleDateString()}</td>
                      <td>{endDate.toLocaleDateString()}</td>
                      <td>{leave.type}</td>
                      <td>{duration} days</td>
                      <td>{leave.reason}</td>
                      <td>{leave.adminApproval}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No leave requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
