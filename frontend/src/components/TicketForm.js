import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/Ticket.css";
import Header from "../section/Header";

export default function TicketForm() {
  const [userID, setUserID] = useState("");
  const [description, setDescription] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(selectedFile.type)) {
      Swal.fire(
        "Invalid File Type",
        "Please upload a PDF, JPEG, or PNG file.",
        "error"
      );
      return;
    }
    if (selectedFile.size > maxSize) {
      Swal.fire(
        "File Too Large",
        "File size exceeds 5MB. Please upload a smaller file.",
        "error"
      );
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userID) {
      Swal.fire("Missing User ID", "Please log in again.", "error");
      return;
    }

    if ((leaveType === "Educational" || leaveType === "Medical") && !file) {
      Swal.fire(
        "File Required",
        "Please upload a file for the selected leave type.",
        "error"
      );
      return;
    }

    const formData = new FormData();
    formData.append("userID", userID);
    formData.append("description", description);
    formData.append("leaveType", leaveType);
    if (file) {
      formData.append("file", file);
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/tickets/add`, // Use environment variable here
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const ticketId = response.data.ticket._id;

      Swal.fire({
        title: "Ticket Submitted",
        text: `Your ticket has been successfully submitted! Ticket ID: ${ticketId}`,
        icon: "success",
        confirmButtonText: "View Ticket",
      }).then(() => {
        navigate(`/tickets/${ticketId}`); // Navigate to the ticket view page using ticketId
      });

      resetForm();
    } catch (error) {
      console.error("Error submitting ticket:", error);
      Swal.fire("Error", "Failed to submit ticket. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setDescription("");
    setLeaveType("");
    setFile(null);
  };

  return (
    <>

      <div className="container-ticket">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <h2 className="text-2xl font-semibold text-gray-700 mb-5">
                    Create a Ticket
                  </h2>

                  <div className="mb-3">
                    <label className="form-label">User ID:</label>
                    <input
                      type="text"
                      value={userID}
                      readOnly
                      className="form-control"
                      placeholder="User ID"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description:</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      className="form-control"
                      placeholder="Enter description"
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Leave Type:</label>
                    <select
                      value={leaveType}
                      onChange={(e) => setLeaveType(e.target.value)}
                      required
                      className="form-control"
                    >
                      <option value="">Select leave type</option>
                      <option value="Personal">Personal</option>
                      <option value="Educational">Educational</option>
                      <option value="Medical">Medical</option>
                    </select>
                  </div>

                  {(leaveType === "Educational" || leaveType === "Medical") && (
                    <div className="mb-3">
                      <label className="form-label">Upload File:</label>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="form-control"
                        required
                      />
                      {file && (
                        <div className="mt-2 text-sm text-gray-700">
                          <strong>Selected File:</strong> {file.name}
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary w-100 mt-3"
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : "Submit Ticket"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

