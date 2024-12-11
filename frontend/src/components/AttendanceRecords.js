import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

const AttendanceRecords = () => {
  const [userId, setUserId] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [records, setRecords] = useState([]);

  const fetchRecords = async () => {
    try {
      const response = await axios.get("http://localhost:8070/attendance/records", {
        params: { userId, year, month },
      });
      setRecords(response.data.attendanceRecords);
      Swal.fire({
        icon: 'success',
        title: 'Records Fetched Successfully',
        text: 'Attendance records have been loaded.',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'An error occurred while fetching records.',
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Attendance Records</h2>
      <div className="space-y-4">
        <div>
          <label className="block font-medium">User ID:</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter User ID"
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
            <ul className="space-y-2 mt-2">
              {records.map((record, index) => (
                <li key={index} className="border-b py-2">
                  <p>{record.date} - {record.status}</p>
                  <p>Work Hours: {record.workHours} hrs</p>
                  <p>Overtime: {record.overtimeHours} hrs</p>
                  <p>Remarks: {record.remarks}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceRecords;
