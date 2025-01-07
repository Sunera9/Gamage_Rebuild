import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../section/Header";
import Swal from "sweetalert2";

export default function ViewLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [userID, setUserID] = useState("");

  // Fetch userId from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const tokenPayload = JSON.parse(atob(parsedUser.token.split(".")[1]));
        setUserID(tokenPayload.userId);
      } catch (error) {
        console.error("Error parsing token:", error);
        Swal.fire("Invalid Token", "Please log in again.", "error");
      }
    } else {
      Swal.fire("Missing Token", "Please log in again.", "error");
    }
  }, []);

  // Fetch leaves for the user
  useEffect(() => {
    if (userID) {
      axios
        .get(`http://localhost:8070/leaves/user/${userID}`)
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
  }, [userID]);

  return (
    <>
      <Header />
      <div className="container-ticket">
        <h2 className="text-2xl font-semibold text-gray-700 my-5">My Leave Requests</h2>
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Leave ID</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Type</th>
                <th>Duration</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length > 0 ? (
                leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>{leave._id}</td>
                    <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                    <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                    <td>{leave.type}</td>
                    <td>{leave.duration}</td>
                    <td>{leave.reason}</td>
                    <td>{leave.status}</td>
                  </tr>
                ))
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
