import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Ticket.css"; // Assuming you have your CSS for styling

const TicketForm = () => {
  const navigate = useNavigate();

  // States for the ticket form fields
  const [ticket, setTicket] = useState({
    description: "",
    leaveType: "",
    files: [],
  });
  const [showModal, setShowModal] = useState(false); // Modal state

  // Handle input change for all fields
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "files") {
      setTicket({
        ...ticket,
        [name]: files,
      });
    } else {
      setTicket({
        ...ticket,
        [name]: value,
      });
    }
  };

  // Handle form submission
  const submitTicket = async () => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");

    // Check if the token is available
    if (!token) {
      alert("You must be logged in to create a ticket.");
      navigate("/login");
      return;
    }

    // Prepare FormData for file upload
    const formData = new FormData();
    formData.append("description", ticket.description);
    formData.append("leaveType", ticket.leaveType);

    // Loop through files and append them to FormData
    Array.from(ticket.files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      // POST request to create a new ticket
      const response = await axios.post(
        "http://localhost:8070/tickets/create-ticket",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Attach the token to the request header
          },
        }
      );

      // Show success modal and reset the form
      setShowModal(true);
      setTicket({ description: "", leaveType: "", files: [] });
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Failed to submit ticket. Please try again.");
    }
  };

  // Close success modal
  const handleOK = () => {
    setShowModal(false);
    navigate("/tickets"); // Redirect to the ticket list page
  };

  return (
    <div className="container-ticket">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              {/* Success Modal */}
              {showModal && (
                <div className="modal" style={{ display: "block" }}>
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Ticket Submitted</h5>
                      </div>
                      <div className="modal-body">
                        <p>Your ticket has been successfully submitted!</p>
                      </div>
                      <div className="modal-footer">
                        <Link
                          to="/tickets"
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

              {/* Ticket Form */}
              <form onSubmit={(e) => e.preventDefault()}>
                <h2 className="text-2xl font-semibold text-gray-700 mb-5">
                  Create a Ticket
                </h2>

                {/* Description Field */}
                <div className="mb-3">
                  <label className="form-label">Description:</label>
                  <textarea
                    name="description"
                    value={ticket.description}
                    onChange={handleChange}
                    required
                    className="form-control"
                    placeholder="Enter description"
                  ></textarea>
                </div>

                {/* Leave Type Field */}
                <div className="mb-3">
                  <label className="form-label">Leave Type:</label>
                  <select
                    name="leaveType"
                    value={ticket.leaveType}
                    onChange={handleChange}
                    required
                    className="form-control"
                  >
                    <option value="">Select leave type</option>
                    <option value="Personal">Personal</option>
                    <option value="Educational">Educational</option>
                    <option value="Medical">Medical</option>
                  </select>
                </div>

                {/* File Upload Field (Only for Educational or Medical leave types) */}
                {(ticket.leaveType === "Educational" ||
                  ticket.leaveType === "Medical") && (
                  <div className="mb-3">
                    <label className="form-label">Upload Files:</label>
                    <input
                      type="file"
                      name="files"
                      onChange={handleChange}
                      multiple
                      className="form-control"
                    />
                    {ticket.files.length > 0 && (
                      <div className="mt-2 text-sm text-gray-700">
                        <strong>Selected Files:</strong>{" "}
                        {Array.from(ticket.files).map((file) => (
                          <div key={file.name}>{file.name}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={submitTicket}
                  className="btn btn-primary w-100 mt-3"
                >
                  Submit Ticket
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketForm;
