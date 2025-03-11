import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import gamgelogo from "../assest/img/brand/gamageLogoEn.jpeg";
import "react-calendar/dist/Calendar.css";

const DashboardCard = () => {
  const [dashboardCounts, setDashboardCounts] = useState({
    totalApplications: 0,
    totalTickets: 0,
    totalEmployees: 0,
  });
  const [date, setDate] = useState(new Date());

useEffect(() => {
  const fetchCounts = async () => {
    try {
      const [appRes, ticketRes, employeeRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/application/count`),
        fetch(`${process.env.REACT_APP_BACKEND_URL}/tickets/count`),
        fetch(
          `${process.env.REACT_APP_BACKEND_URL}/users/getRoleCount/employee`
        ),
      ]);

      if (!appRes.ok || !ticketRes.ok || !employeeRes.ok) {
        throw new Error("One of the API requests failed");
      }

      const [appData, ticketData, employeeData] = await Promise.all([
        appRes.json(),
        ticketRes.json(),
        employeeRes.json(),
      ]);

      console.log("Application Data:", appData);
      console.log("Ticket Data:", ticketData);
      console.log("Employee Data:", employeeData);

      setDashboardCounts({
        totalApplications: appData.count || 0, // Fix the property name
        totalTickets: ticketData.totalTickets || 0,
        totalEmployees: employeeData.count || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard statistics:", error);
    }
  };

  fetchCounts();
}, []);

  return (
    <div>
      
      {/* Company Logo Section */}
      <div className="flex justify-center mb-6">
        <img src={gamgelogo} alt="Company Logo" className="w-1/6" />
      </div>

      <div className="flex items-start justify-center gap-8">
        {/* Left Section - Dashboard Cards */}
        <div className="w-1/3 flex flex-col gap-6">
          <div className="bg-blue-100 text-blue-800 p-4 rounded shadow flex items-center gap-4">
            <span className="text-3xl">📑</span>
            <div>
              <h3 className="text-lg font-semibold">Total Applications</h3>
              <p className="text-2xl font-bold">
                {dashboardCounts.totalApplications}
              </p>
            </div>
          </div>

          <div className="bg-yellow-100 text-yellow-800 p-4 rounded shadow flex items-center gap-4">
            <span className="text-3xl">🎟️</span>
            <div>
              <h3 className="text-lg font-semibold">Total Tickets</h3>
              <p className="text-2xl font-bold">
                {dashboardCounts.totalTickets}
              </p>
            </div>
          </div>

          <div className="bg-green-100 text-green-800 p-4 rounded shadow flex items-center gap-4">
            <span className="text-3xl">👨‍💼</span>
            <div>
              <h3 className="text-lg font-semibold">Total Employees</h3>
              <p className="text-2xl font-bold">
                {dashboardCounts.totalEmployees}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-300 text-gray-900">
          <Calendar
            onChange={setDate}
            value={date}
            className="w-full h-full"
            tileClassName="text-gray-900 font-semibold"
            style={{ "--fc-small-text-color": "#1f2937" }} // Some calendars use this variable
          />
        </div>

        {/* <Calendar
          onChange={setDate}
          value={date}
          className="w-full h-full"
          style={{ color: '#1f2937' }} 
        /> */}
      </div>
    </div>
  );
};

export default DashboardCard;
