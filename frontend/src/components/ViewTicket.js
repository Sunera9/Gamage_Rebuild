import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Header from "../section/Header";

export default function ViewTicket() {
  const { ticketId } = useParams(); // Get ticket ID from URL params
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch ticket details
    const fetchTicket = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8070/tickets/${ticketId}`
        );
        setTicket(response.data.ticket);
      } catch (error) {
        console.error("Error fetching ticket details:", error);
        Swal.fire(
          "Error",
          "Failed to fetch ticket details. Please try again later.",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading ticket details...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="error-container">
        <p>Unable to find ticket details. Please check the ticket ID.</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container-view-ticket">
        <div className="card">
          <div className="card-body">
            <h2 className="text-2xl font-semibold text-gray-700 mb-5">
              Ticket Details
            </h2>
            <p>
              <strong>Ticket ID:</strong> {ticket._id}
            </p>
            <p>
              <strong>User ID:</strong> {ticket.userID}
            </p>
            <p>
              <strong>Description:</strong> {ticket.description}
            </p>
            <p>
              <strong>Leave Type:</strong> {ticket.leaveType}
            </p>
            <p>
              <strong>Status:</strong> {ticket.status}
            </p>
            {ticket.fileUrl && (
              <p>
                <strong>Uploaded File:</strong>{" "}
                <a
                  href={ticket.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View File
                </a>
              </p>
            )}
            {ticket.comments && ticket.comments.length > 0 && (
              <div className="comments-section">
                <strong>Comments:</strong>
                <ul>
                  {ticket.comments.map((comment, index) => (
                    <li key={index}>{comment}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
