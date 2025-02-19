import React, { useState, useEffect } from "react";

const DashboardCard = () => {
  const [dashboardCounts, setDashboardCounts] = useState({
    totalApplications: 0,
    totalTickets: 0,
    totalEmployees: 0, // Add state for role count (total employees)
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch total applications, tickets, and employees count in parallel
        const [appRes, ticketRes, employeeRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/applications/count`),
          fetch(`${process.env.REACT_APP_BACKEND_URL}/tickets/count`),
          fetch(
            `${process.env.REACT_APP_BACKEND_URL}/users/getRoleCount/employee`
          ), 
        ]);

        // Convert responses to JSON
        const [appData, ticketData, employeeData] = await Promise.all([
          appRes.json(),
          ticketRes.json(),
          employeeRes.json(),
        ]);

        // Update state with counts
        setDashboardCounts({
          totalApplications: appData.totalApplications || 0,
          totalTickets: ticketData.totalTickets || 0,
          totalEmployees: employeeData.count || 0, // Set the total employee count
        });
      } catch (error) {
        console.error("Error fetching dashboard statistics:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-6xl bg-white shadow-md rounded p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Dashboard Summary
        </h2>
        <div className="flex justify-between gap-6">
          {/* Adjusted flex layout to display in one row */}

          <div className="bg-blue-100 text-blue-800 p-4 rounded shadow flex-1">
            <h3 className="text-lg font-semibold">Total Applications</h3>
            <p className="text-2xl font-bold">
              {dashboardCounts.totalApplications}
            </p>
          </div>

          <div className="bg-yellow-100 text-yellow-800 p-4 rounded shadow flex-1">
            <h3 className="text-lg font-semibold">Total Tickets</h3>
            <p className="text-2xl font-bold">{dashboardCounts.totalTickets}</p>
          </div>

          <div className="bg-green-100 text-green-800 p-4 rounded shadow flex-1">
            <h3 className="text-lg font-semibold">Total Employees</h3>
            <p className="text-2xl font-bold">
              {dashboardCounts.totalEmployees}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
