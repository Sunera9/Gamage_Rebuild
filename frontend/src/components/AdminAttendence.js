import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

const AdminAttendence = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");

  const handleAdminUpdate = async () => {
    try {
      const response = await axios.put("http://localhost:8070/attendance/admin-update", {
        email,
        date: attendanceDate,
        status,
        remarks,
      });
  
      Swal.fire({
        icon: "success",
        title: "Attendance Updated",
        text: response.data.message,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "An error occurred while updating attendance.",
      });
    }
  };
  

  const markHoliday = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8070/attendance/mark-holiday",
        { date }
      );
      Swal.fire({
        icon: "success",
        title: "Holiday Marked",
        text: response.data.message,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "An error occurred",
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Admin Attendance Management
      </h2>
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
              <label className="block font-medium">Date:</label>
              <input
                type="date"
                className="w-full px-4 py-2 border rounded-md"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
              />
            </div>
        <div>
          <label className="block font-medium">Status:</label>
          <select
            className="w-full px-4 py-2 border rounded-md"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Select Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Leave">Leave</option>
            <option value="Holiday">Holiday</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Remarks:</label>
          <textarea
            className="w-full px-4 py-2 border rounded-md"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Add remarks"
          />
        </div>
      </div>

      <div>
        <button
          onClick={handleAdminUpdate}
          className="w-full py-2 bg-gray-500 text-white rounded-md mt-2"
        >
          Update Attendance
        </button>

        <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Mark Holiday
          </h2>
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

export default AdminAttendence;
