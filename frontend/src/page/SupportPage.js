import React, { useState, useEffect } from "react";
import axios from "axios";

const SupportPage = () => {
  const [tickets, setTickets] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("tickets"); // Default tab is "tickets"

 useEffect(() => {
   const fetchData = async () => {
     try {
       setLoading(true);

       // Fetch tickets
       const ticketsResponse = await axios.get(
         `${process.env.REACT_APP_BACKEND_URL}/tickets/get`
       );
       setTickets(ticketsResponse.data.tickets);

       // Fetch leaves
       const leavesResponse = await axios.get(
         `${process.env.REACT_APP_BACKEND_URL}/leaves/get`
       );
       setLeaves(leavesResponse.data);

       setLoading(false);
     } catch (err) {
       console.error("Error fetching data:", err);
       setError("Failed to load data. Please try again later.");
       setLoading(false);
     }
   };

   fetchData();
 }, []);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-gray-600 text-lg font-semibold">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
        {/* <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">Support Page</h1> */}

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <button
            className={`px-6 py-2 rounded-t-lg ${activeTab === "tickets" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setActiveTab("tickets")}
          >
            View Tickets
          </button>
          <button
            className={`px-6 py-2 rounded-t-lg ${activeTab === "leaves" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setActiveTab("leaves")}
          >
            View Leaves
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "tickets" && (
          <div className="mb-12">
            {/* <h2 className="text-2xl font-semibold text-gray-700 mb-4">Tickets</h2> */}
            {tickets.length > 0 ? (
              <table className="table-auto w-full bg-white shadow-md rounded-lg">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="px-4 py-2">Ticket ID</th>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Leave Type</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket._id} className="border-t">
                      <td className="px-4 py-2">{ticket._id}</td>
                      <td className="px-4 py-2">{ticket.description}</td>
                      <td className="px-4 py-2">{ticket.status}</td>
                      <td className="px-4 py-2">{ticket.leaveType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600">No tickets found.</p>
            )}
          </div>
        )}

        {activeTab === "leaves" && (
          <div>
            {/* <h2 className="text-2xl font-semibold text-gray-700 mb-4">Leaves</h2> */}
            {leaves.length > 0 ? (
              <table className="table-auto w-full bg-white shadow-md rounded-lg">
                <thead className="bg-green-500 text-white">
                  <tr>
                    <th className="px-4 py-2">Leave ID</th>
                    <th className="px-4 py-2">Start Date</th>
                    <th className="px-4 py-2">End Date</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Duration</th>
                    <th className="px-4 py-2">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave._id} className="border-t">
                      <td className="px-4 py-2">{leave._id}</td>
                      <td className="px-4 py-2">
                        {new Date(leave.startDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        {new Date(leave.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">{leave.type}</td>
                      <td className="px-4 py-2">{leave.duration}</td>
                      <td className="px-4 py-2">{leave.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600">No leave requests found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportPage;
