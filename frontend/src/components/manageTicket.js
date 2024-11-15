import React, { useEffect, useState } from "react";
import axios from "axios";
import "./manageTicket.css";

function TicketsTable() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null); // Track selected ticket
  const [showModal, setShowModal] = useState(false); // Control modal visibility

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
    setSelectedTicket(ticket); // Set selected ticket details
    setShowModal(true); // Show the modal
  };

  const handleAccept = () => {
    console.log(`Accepted ticket with ID: ${selectedTicket._id}`);
    setShowModal(false); // Close the modal
  };

  const handleReject = () => {
    console.log(`Rejected ticket with ID: ${selectedTicket._id}`);
    setShowModal(false); // Close the modal
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
                <button
                  // onClick={() => handleEmail(ticket._id)}
                  title="Send Email"
                >
                  ✉️
                </button>
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
