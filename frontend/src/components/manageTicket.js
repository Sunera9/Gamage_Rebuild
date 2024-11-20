import React, { useEffect, useState } from "react";
import axios from "axios";
import "./manageTicket.css";

function TicketsTable() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get("http://localhost:8070/tickets/get");
        setTickets(response.data.tickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, []);

  const handleIdClick = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const handleAccept = () => {
    console.log(`Accepted ticket with ID: ${selectedTicket._id}`);
    setShowModal(false);
  };

  const handleReject = () => {
    console.log(`Rejected ticket with ID: ${selectedTicket._id}`);
    setShowModal(false);
  };

const handleImageDownload = (fileUrl, fileName) => {
  // Modify the URL to force download using Cloudinary's `fl_attachment` parameter
  const downloadUrl = fileUrl.replace("/upload/", "/upload/fl_attachment/");
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = fileName || "downloaded_image.jpg";
  link.target = "_blank"; // Opens the download in a new tab if needed
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  return (
    <div className="tickets-table">
      <div className="title">
        <h2>Tickets</h2>
      </div>

      <table className="tickets-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Description</th>
            <th>Status</th>
            <th>Leave Type</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket._id}>
              <td
                onClick={() => handleIdClick(ticket)}
                style={{
                  cursor: "pointer",
                  color: "blue",
                  textDecoration: "underline",
                }}
              >
                {ticket._id}
              </td>
              <td>{ticket.description}</td>
              <td>{ticket.status}</td>
              <td>{ticket.leaveType}</td>
              <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
              <td>
                <button title="Send Email">✉️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && selectedTicket && (
        <div className="modal">
          <div className="modal-content">
            <h3>Ticket Details</h3>
            <p>
              <strong>ID:</strong> {selectedTicket._id}
            </p>
            <p>
              <strong>Description:</strong> {selectedTicket.description}
            </p>
            <p>
              <strong>Status:</strong> {selectedTicket.status}
            </p>
            <p>
              <strong>Leave Type:</strong> {selectedTicket.leaveType}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedTicket.createdAt).toLocaleDateString()}
            </p>

            {/* Render download button if there's an image URL in files */}
            {selectedTicket.files?.url && (
              <button
                onClick={() =>
                  handleImageDownload(
                    selectedTicket.files.url,
                    selectedTicket.files.fileName
                  )
                }
                className="download-button"
              >
                Download Attachment
              </button>
            )}

            <div className="modal-buttons">
              <button onClick={handleAccept} className="accept-button">
                Accept
              </button>
              <button onClick={handleReject} className="reject-button">
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TicketsTable;
