import React, { useEffect, useState } from "react";

const TicketsTable = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8070/tickets/get") // Use your actual backend URL here
      .then((response) => {
        if (!response.ok) throw new Error("Error fetching tickets");
        return response.json();
      })
      .then((data) => setTickets(data.tickets))
      .catch((error) => setError(error.message));
  }, []);

  return (
    <div>
      <h1>Tickets</h1>
      {error && <p>Error: {error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            {/* Add more headers based on your data */}
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket._id}>
              <td>{ticket._id}</td>
              <td>{ticket.status}</td>
              {/* Render more fields based on your data */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketsTable;
