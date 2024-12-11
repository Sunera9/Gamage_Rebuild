import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

const AttendanceForm = () => {
  const [userId, setUserId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleEntry = async () => {
    try {
      const response = await axios.post(`http://localhost:8070/attendance/entry?userId=${userId}`);
      Swal.fire({
        icon: 'success',
        title: 'Entry Recorded',
        text: response.data.message,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'An error occurred',
      });
    }
  };

  const handleExit = async () => {
    try {
      const response = await axios.post(`http://localhost:8070/attendance/exit?userId=${userId}`);
      Swal.fire({
        icon: 'success',
        title: 'Exit Recorded',
        text: response.data.message,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'An error occurred',
      });
    }
  };

  const markHoliday = async () => {
    try {
      const response = await axios.post("http://localhost:8070/attendance/mark-holiday", { date });
      Swal.fire({
        icon: 'success',
        title: 'Holiday Marked',
        text: response.data.message,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'An error occurred',
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Attendance Management</h2>
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
          <button
            onClick={handleEntry}
            className="w-full py-2 bg-blue-500 text-white rounded-md"
          >
            Mark Entry
          </button>
        </div>

        <div>
          <button
            onClick={handleExit}
            className="w-full py-2 bg-green-500 text-white rounded-md"
          >
            Mark Exit
          </button>
        </div>

        <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-4">Mark Holiday</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-medium">Holiday Date:</label>
              <input
                type="date"
                className="w-full px-4 py-2 border rounded-md"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <button
                onClick={markHoliday}
                className="w-full py-2 bg-red-500 text-white rounded-md"
              >
                Mark Holiday
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceForm;
