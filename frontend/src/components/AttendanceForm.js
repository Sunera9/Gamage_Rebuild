import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

const AttendanceForm = () => {
  const [userId, setUserId] = useState("");
  const [isEntryMarked, setIsEntryMarked] = useState(false);
  const [isExitMarked, setIsExitMarked] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [isAttendanceVisible, setIsAttendanceVisible] = useState(false); // State for showing/hiding attendance table

  useEffect(() => {
    // Reset button state for a new day
    const today = new Date().toISOString().split("T")[0]; // Get the date in YYYY-MM-DD format
    const lastMarkedDate = localStorage.getItem("lastMarkedDate");

    if (lastMarkedDate !== today) {
      setIsEntryMarked(false);
      setIsExitMarked(false);
      localStorage.setItem("lastMarkedDate", today);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const tokenPayload = JSON.parse(atob(parsedUser.token.split(".")[1]));
        setUserId(tokenPayload.userId);
      } catch (error) {
        console.error("Error parsing token:", error);
        Swal.fire("Invalid Token", "Please log in again.", "error");
      }
    } else {
      Swal.fire("Missing Token", "Please log in again.", "error");
    }
  }, []);

  const validateUserId = (id) => {
    // Check if userId is a valid MongoDB ObjectId format
    return /^[a-fA-F0-9]{24}$/.test(id);
  };

  // Handle entry
  const handleEntry = async () => {
    if (!validateUserId(userId)) {
      Swal.fire({
        icon: "error",
        title: "Invalid User ID",
        text: "Please enter a valid User ID (24-character hexadecimal).",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/attendance/entry?userId=${userId}`
      );
      Swal.fire({
        icon: "success",
        title: "Entry Recorded",
        text: response.data.message,
      });
      setIsEntryMarked(true);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "An error occurred while marking entry.",
      });
    }
  };

  // Handle exit
  const handleExit = async () => {
    if (!validateUserId(userId)) {
      Swal.fire({
        icon: "error",
        title: "Invalid User ID",
        text: "Please enter a valid User ID (24-character hexadecimal).",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/attendance/exit?userId=${userId}`
      );
      Swal.fire({
        icon: "success",
        title: "Exit Recorded",
        text: response.data.message,
      });
      setIsExitMarked(true);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "An error occurred while marking exit.",
      });
    }
  };

  // View attendance
  const handleViewAttendance = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/attendance/all`
      );

      if (response.data && response.data.attendanceRecords) {
        // Format the date to display only the date (YYYY-MM-DD)
        const formattedData = response.data.attendanceRecords.map(
          (attendance) => ({
            ...attendance,
            date: new Date(attendance.date).toISOString().split("T")[0], // Format the date
          })
        );
        setAttendanceData(formattedData);
        setIsAttendanceVisible(true); // Show the table after fetching the data
      } else {
        Swal.fire({
          icon: "error",
          title: "No Attendance Records",
          text: "No attendance records found for today.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "An error occurred while fetching attendance data.",
      });
    }
  };

  return (
    <div className="max-w-xl mt-16 mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Attendance Management
      </h2>
      <div className="space-y-4">
        {/* <div>
          <label className="block font-medium">User ID:</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter User ID"
          />
        </div> */}

        <div>
          <button
            onClick={handleEntry}
            className={`w-full py-2 text-white rounded-md ${
              isEntryMarked ? "bg-gray-400" : "bg-blue-500"
            }`}
            disabled={isEntryMarked}
          >
            Mark Entry
          </button>
        </div>

        <div>
          <button
            onClick={handleExit}
            className={`w-full py-2 text-white rounded-md ${
              isExitMarked || !isEntryMarked ? "bg-gray-400" : "bg-green-500"
            }`}
            disabled={isExitMarked || !isEntryMarked}
          >
            Mark Exit
          </button>
        </div>

        {/* View Attendance Button */}
        <div>
          <button
            onClick={handleViewAttendance}
            className="w-full py-2 text-white rounded-md bg-purple-500"
          >
            View Attendance
          </button>
        </div>
      </div>

      {/* Display Attendance Table */}
      {isAttendanceVisible && (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Entry Time</th>
                <th className="px-4 py-2 border">Exit Time</th>
                <th className="px-4 py-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((attendance, index) => (
                <tr key={index} className="odd:bg-gray-50">
                  <td className="px-4 py-2 border">{attendance.entryTime}</td>
                  <td className="px-4 py-2 border">{attendance.exitTime}</td>
                  <td className="px-4 py-2 border">{attendance.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceForm;
