import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewTicket = () => {
  const { id } = useParams(); // Get the ticket ID from the URL
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
       const response = await axios.get(
         `${process.env.REACT_APP_BACKEND_URL}/tickets/get/${id}`
       );

        setTicket(response.data.ticket);
      } catch (err) {
        console.error("Error fetching ticket details:", err);
        setError("Failed to load ticket details.");
      }
    };
    fetchTicket();
  }, [id]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-xl font-semibold">{error}</div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex items-center justify-center h-screen ">
        <div className="text-gray-800 text-xl font-medium animate-pulse">
          Loading ticket details...
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          🎟️ Ticket Details
        </h1>
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="font-semibold text-gray-600 text-lg w-32">ID:</span>
            <span className="text-gray-700 text-lg">{ticket._id}</span>
          </div>
          <div className="flex items-start">
            <span className="font-semibold text-gray-600 text-lg w-32">Description:</span>
            <span className="text-gray-700 text-lg">{ticket.description}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold text-gray-600 text-lg w-32">Status:</span>
            <span
              className={`text-lg font-bold px-3 py-1 rounded-full ${
                ticket.status === "Approved"
                  ? "bg-green-200 text-green-800"
                  : ticket.status === "Rejected"
                  ? "bg-red-200 text-red-800"
                  : "bg-yellow-200 text-yellow-800"
              }`}
            >
              {ticket.status}
            </span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold text-gray-600 text-lg w-32">Leave Type:</span>
            <span className="text-gray-700 text-lg">{ticket.leaveType}</span>
          </div>
          {ticket.files?.url && (
            <div className="flex items-center">
              <span className="font-semibold text-gray-600 text-lg w-32">File:</span>
              <a
                href={ticket.files.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 underline text-lg"
              >
                View File
              </a>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-center">
          <button
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:shadow-xl transition-shadow"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTicket;
