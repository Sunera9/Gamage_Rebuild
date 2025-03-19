import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";

export default function ViewLeaves() {
  const [leaves, setLeaves] = useState(null);
  const [userId, setUserID] = useState("");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

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
      <div className="container-ticket">
        <h2 className="text-2xl font-semibold text-gray-700 my-5">
          My Leave Request
        </h2>
        <div className="overflow-x-auto">
          <table className="table table-striped table-bordered min-w-full">
            <thead className="thead-dark">
              <tr>
                <th className="px-4 py-2">Leave ID</th>
                <th className="px-4 py-2">Employee Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Start Date</th>
                <th className="px-4 py-2">End Date</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Duration</th>
                <th className="px-4 py-2">Reason</th>
                <th className="px-4 py-2">Admin Approval</th>
                <th className="px-4 py-2">Supervisor Approval</th>
              </tr>
            </thead>
            <tbody>
              {leaves ? (
                <tr key={leaves._id} className="whitespace-nowrap">
                  <td className="px-4 py-2">{leaves._id}</td>
                  <td className="px-4 py-2">{leaves.User?.name || "N/A"}</td>
                  <td className="px-4 py-2">{leaves.User?.email || "N/A"}</td>
                  <td className="px-4 py-2">
                    {new Date(leaves.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(leaves.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{leaves.type}</td>
                  <td className="px-4 py-2">{leaves.duration}</td>
                  <td className="px-4 py-2">{leaves.reason}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`badge ${
                        leaves.adminApproval === "Approved"
                          ? "badge-success"
                          : leaves.adminApproval === "Rejected"
                          ? "badge-danger"
                          : "badge-warning"
                      }`}
                    >
                      {leaves.adminApproval}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`badge ${
                        leaves.supervisorApproval === "Approved"
                          ? "badge-success"
                          : leaves.supervisorApproval === "Rejected"
                          ? "badge-danger"
                          : "badge-warning"
                      }`}
                    >
                      {leaves.supervisorApproval}
                    </span>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="10" className="text-center px-4 py-2">
                    No leave requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-center">
          <span className="text-red-500">
            *You will receive an email regarding your request whether it's
            approved or not!*
          </span>
        </div>
      </div>
    </>
  );
}
