import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

const AttendanceRecords = () => {
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [records, setRecords] = useState([]);

  const fetchRecords = async () => {
    try {
      const response = await axios.get("http://localhost:8070/attendance/records", {
        params: { email, year, month },
      });
      setRecords(response.data.attendanceRecords);
      Swal.fire({
        icon: "success",
        title: "Records Fetched Successfully",
        text: "Attendance records have been loaded.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message || "An error occurred while fetching records.",
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Attendance Records</h2>
      <div className="space-y-4">
        <div>
          <label className="block font-medium">Email:</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter User Email"
          />
        </div>

        <div>
          <label className="block font-medium">Year:</label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded-md"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Enter Year"
          />
        </div>

        <div>
          <label className="block font-medium">Month:</label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded-md"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            placeholder="Enter Month"
          />
        </div>

        <div>
          <button
            onClick={fetchRecords}
            className="w-full py-2 bg-blue-500 text-white rounded-md"
          >
            Fetch Attendance
          </button>
        </div>

        {records.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xl font-semibold">Attendance Summary</h3>
            <table className="min-w-full mt-2 table-auto border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Work Hours</th>
                  <th className="px-4 py-2 border">Overtime Hours</th>
                  <th className="px-4 py-2 border">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, index) => {
                  // Format the date to YYYY-MM-DD format
                  const formattedDate = new Date(record.date)
                    .toISOString()
                    .split("T")[0];

                  return (
                    <tr key={index} className="text-center">
                      <td className="px-4 py-2 border">{formattedDate}</td>
                      <td className="px-4 py-2 border">{record.status}</td>
                      <td className="px-4 py-2 border">{record.workHours} hrs</td>
                      <td className="px-4 py-2 border">{record.overtimeHours} hrs</td>
                      <td className="px-4 py-2 border">{record.remarks}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceRecords;
