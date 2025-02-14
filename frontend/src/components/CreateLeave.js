import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Header from "../section/Header";
import Swal from "sweetalert2";

export default function CreateLeave() {
  const [leaveDetails, setLeaveDetails] = useState({
    userId: "",
    startDate: "",
    endDate: "",
    type: "Common", // default value
    reason: "",
    duration: "", // duration is now part of leaveDetails
  });
  const [showModal, setShowModal] = useState(false); // Modal state
  const [message, setMessage] = useState("");
  const [userID, setUserID] = useState("");
  const navigate = useNavigate();

  // Populate userId from token
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const tokenPayload = JSON.parse(atob(parsedUser.token.split(".")[1]));
        setUserID(tokenPayload.userId);
        setLeaveDetails((prevDetails) => ({
          ...prevDetails,
          userId: tokenPayload.userId, // Set userId in leaveDetails
        }));
      } catch (error) {
        console.error("Error parsing token:", error);
        Swal.fire("Invalid Token", "Please log in again.", "error");
      }
    } else {
      Swal.fire("Missing Token", "Please log in again.", "error");
    }
  }, []);

  // Consolidated handleChange for all fields, including duration
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeaveDetails({ ...leaveDetails, [name]: value });
  };

  const handleDurationChange = (e) => {
    setLeaveDetails({ ...leaveDetails, duration: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!userID) {
        throw new Error("Token is missing. Please log in again.");
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/leaves/add`, // Use environment variable here
        leaveDetails,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Show success alert
      Swal.fire({
        icon: "success",
        title: "Leave Request Submitted",
        text: "Your leave request has been successfully submitted!",
        confirmButtonText: "OK",
      }).then(() => {
        //navigate("/viewleaves");
        setShowModal(true); // Show the modal upon successful submission
        resetForm(); // Reset the form after user acknowledges the success message
      });
    } catch (error) {
      console.error("Error submitting leave:", error);

      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.status || error.message,
      });
    }
  };

  const resetForm = () => {
    setLeaveDetails({
      userId: leaveDetails.userId,
      startDate: "",
      endDate: "",
      type: "Common",
      reason: "",
      duration: "",
    });
  };

  const handleOK = () => {
    setShowModal(false);
  };

  return (
    <>
      <Header />
      <div className="container-ticket">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-body">
                {showModal && (
                  <div className="modal" style={{ display: "block" }}>
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">
                            Leave Request Submitted
                          </h5>
                        </div>
                        <div className="modal-body">
                          <p>
                            Your leave request has been successfully submitted!
                          </p>
                        </div>
                        <div className="modal-footer">
                          <Link
                            to="/leaves"
                            className="btn btn-primary"
                            onClick={handleOK}
                          >
                            OK
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <h2 className="text-2xl font-semibold text-gray-700 mb-5">
                    Submit a Leave Request
                  </h2>

                  {/* User ID */}
                  <div className="mb-3">
                    <label className="form-label">User ID:</label>
                    <input
                      type="text"
                      name="userId"
                      value={userID}
                      readOnly
                      className="form-control"
                      placeholder="User ID"
                    />
                  </div>

                  {/* Leave Duration */}
                  <div className="mb-3">
                    <label className="form-label">Leave Duration:</label>
                    <div>
                      <label>
                        <input
                          type="radio"
                          name="duration"
                          value="Full Day"
                          checked={leaveDetails.duration === "Full Day"}
                          onChange={handleDurationChange}
                        />{" "}
                        Full Day
                      </label>
                      <div className="mb-3">
                        <input
                          type="radio"
                          name="duration"
                          value="Half Day"
                          checked={leaveDetails.duration === "Half Day"}
                          onChange={handleDurationChange}
                        />{" "}
                        Half Day
                      </div>
                    </div>
                  </div>

                  {/* Start Date */}
                  <div className="mb-3">
                    <label className="form-label">Start Date:</label>
                    <input
                      type="date"
                      name="startDate"
                      value={leaveDetails.startDate}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>

                  {/* End Date */}
                  <div className="mb-3">
                    <label className="form-label">End Date:</label>
                    <input
                      type="date"
                      name="endDate"
                      value={leaveDetails.endDate}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>

                  {/* Leave Type */}
                  <div className="mb-3">
                    <label className="form-label">Leave Type:</label>
                    <select
                      name="type"
                      value={leaveDetails.type}
                      onChange={handleChange}
                      required
                      className="form-control"
                    >
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Annual Leave">Annual Leave</option>
                      <option value="Maternity Leave">Maternity Leave</option>
                      <option value="Personal Leave">Personal Leave</option>
                      <option value="Common">Common</option>
                      <option value="Paternity Leave">Paternity Leave</option>
                    </select>
                  </div>

                  {/* Reason */}
                  <div className="mb-3">
                    <label className="form-label">Reason:</label>
                    <textarea
                      name="reason"
                      value={leaveDetails.reason}
                      onChange={handleChange}
                      required
                      className="form-control"
                      placeholder="Enter reason for leave"
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary w-100 mt-3">
                    Submit Leave Request
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        {message && <p className="mt-3 text-center">{message}</p>}
      </div>
    </>
  );
}
