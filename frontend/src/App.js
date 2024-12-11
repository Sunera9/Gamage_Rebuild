import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Dashboard from './page/Dashboard';
import TicketForm from './components/TicketForm';
import CreateLeave from './components/CreateLeave';
import Login from './page/Login';
import Register from './page/Register';
import Layout_1 from './layouts/Layout_1';
import AllEmployee from './components/AllEmployee';
import TicketsTable from './components/manageTicket';
import LeavesTable from './components/leaveManage';
import Program from './components/Program';
import Application from "./components/Application";
import Profile from "./components/Profile";
import Salary from "./components/Salary";
import SettingsPage from "./components/Setting";
import SalarySlip from "./components/SalarySlip";
import AddUser from "./components/AddUser";
import AddJob from "./components/AddJob";
import JobList from "./components/JobList";
import ApplicationForm from "./components/ApplicationForm";
import AttendanceForm from "./components/AttendanceForm";
import AttendanceRecords from "./components/AttendanceRecords";
import AdminAttendence from "./components/AdminAttendence";


// Authentication wrapper component
const RequireAuth = ({ children }) => {
  const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout_1 />
            </RequireAuth>
          }
        >
          {/* Nested Routes for Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/adduser" element={<AddUser />} />
          <Route path="/tickets" element={<TicketForm />} />
          <Route path="/leaves" element={<CreateLeave />} />
          <Route path="/employee" element={<AllEmployee />} />
          <Route path="/TicketsTable" element={<TicketsTable />} />
          <Route path="/LeavesTable" element={<LeavesTable />} />
          <Route path="/programs" element={<Program />} />
          <Route path="/applications" element={<Application />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/salary/sheet" element={<Salary />} />
          <Route path="/salary/settings" element={<SettingsPage />} />
          <Route path="/slip/:userId/:month/:year" element={<SalarySlip />} />
          <Route path="/addjob" element={<AddJob />} />
          <Route path="/joblist" element={<JobList />} />
          <Route path="/apply/:jobId" element={<ApplicationForm />} />
          <Route path="/attendance/attendenceform" element={<AttendanceForm />} />
          <Route path="/attendance/adminattendence" element={<AdminAttendence />} />
          <Route path="/attendance/attendencerecords" element={<AttendanceRecords />} />
        </Route>

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;