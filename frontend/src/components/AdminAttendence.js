import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

const AdminAttendence = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");

  const handleAdminUpdate = async () => {
    try {
      const response = await axios.put("http://localhost:8070/attendance/admin-update");
      Swal.fire({
        icon: 'success',
        title: 'Attendance Updated',
        text: response.data.message,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'An error occurred while updating attendance.',
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Attendance Management</h2>
      <div className="space-y-4">
        <div>
          <label className="block font-medium">Admin Status:</label>
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
      </div>
    </div>
  );
};

export default AdminAttendence;
