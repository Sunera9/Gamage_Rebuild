import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/manageTicket.css";
import Header from "../section/Header";

function TicketsTable() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);

 useEffect(() => {
   const fetchTickets = async () => {
     try {
       const response = await axios.get(
         `${process.env.REACT_APP_BACKEND_URL}/tickets/get`
       );
       console.log(response);
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

 const handleAccept = async () => {
   try {
     const response = await axios.put(
       `${process.env.REACT_APP_BACKEND_URL}/ticketEmail/accept/${selectedTicket._id}`
     );
     console.log("Ticket accepted:", response.data);
     setShowModal(false);
     setTickets(
       tickets.map((ticket) =>
         ticket._id === selectedTicket._id
           ? { ...ticket, status: "Accepted" }
           : ticket
       )
     );
   } catch (error) {
     console.error("Error accepting ticket:", error);
   }
 };

 const handleReject = async () => {
   try {
     const response = await axios.put(
       `${process.env.REACT_APP_BACKEND_URL}/ticketEmail/reject/${selectedTicket._id}`
     );
     console.log("Ticket rejected:", response.data);
     setShowModal(false);
     setTickets(
       tickets.map((ticket) =>
         ticket._id === selectedTicket._id
           ? { ...ticket, status: "Rejected" }
           : ticket
       )
     );
   } catch (error) {
     console.error("Error rejecting ticket:", error);
   }
 };

 const handleImageDownload = (fileUrl, fileName) => {
   const downloadUrl = fileUrl.replace("/upload/", "/upload/fl_attachment/");
   const link = document.createElement("a");
   link.href = downloadUrl;
   link.download = fileName || "downloaded_image.jpg";
   link.target = "_blank";
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);
 };


  return (
    <>
      <Header />
      <div className="flex justify-center p-6">
        <div className="w-2/10 bg-white shadow-lg rounded-lg">
          <div className="text-center mb-4"></div>

          <table className="min-w-full bg-gray-50 rounded-lg shadow-md overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  User Name
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  User Email
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  Description
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  Leave Type
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  Date
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id} className="hover:bg-gray-100">
                  <td
                    onClick={() => handleIdClick(ticket)}
                    className="py-3 px-4 text-sm text-blue-500 cursor-pointer underline"
                  >
                    {ticket.User?.name || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {ticket.User?.email || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-sm">{ticket.description}</td>
                  <td className="py-3 px-4 text-sm">{ticket.status}</td>
                  <td className="py-3 px-4 text-sm">{ticket.leaveType}</td>
                  <td className="py-3 px-4 text-sm">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <button className="text-gray-600 hover:text-blue-500">
                      ✉️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showModal && selectedTicket && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white rounded-lg p-6 w-1/3 shadow-lg relative">
                <button
                  onClick={() => setShowModal(false)} // Close the modal
                  className="absolute top-2 right-2 bg-gray-200 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-300"
                >
                  ✖
                </button>
                <h3 className="text-xl font-semibold mb-4">Ticket Details</h3>
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

                {selectedTicket.files?.url && (
                  <button
                    onClick={() =>
                      handleImageDownload(
                        selectedTicket.files.url,
                        selectedTicket.files.fileName
                      )
                    }
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Download Attachment
                  </button>
                )}

                <div className="mt-4 flex justify-between">
                  <button
                    onClick={handleAccept}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={handleReject}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default TicketsTable;
