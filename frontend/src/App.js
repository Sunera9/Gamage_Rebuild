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
  const user = JSON.parse(localStorage.getItem("user"));
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
          <Route path="/admin/adduser" element={<AddUser />} />

          {/*Visitor routes */}
          <Route path="/profile" element={<Profile />} />

          {/*Admin routes */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/employee" element={<AllEmployee />} />
          <Route path="/admin/salary/sheet" element={<Salary />} />
          <Route path="/admin/salary/settings" element={<SettingsPage />} />
          <Route path="/admin/slip/:userId/:month/:year" element={<SalarySlip />} />
          <Route path="/admin/addjob" element={<AddJob />} />                   
          <Route path="/admin/attendance/adminattendence" element={<AdminAttendence />} />
          <Route path="/admin/attendance/attendencerecords" element={<AttendanceRecords />} />
          <Route path="/admin/employee" element={<AllEmployee />} />
          <Route path="/admin/TicketsTable" element={<TicketsTable />} />
          <Route path="/admin/LeavesTable" element={<LeavesTable />} />
          

          {/*Employee routes */}
          <Route path="/employee/dashboard" element={<Dashboard />} />
          <Route path="/employee/tickets" element={<TicketForm />} />
          <Route path="/employee/leaves" element={<CreateLeave />} />
          <Route path="/employee/programs" element={<Program />} />    
          <Route path="/employee/apply/:jobId" element={<ApplicationForm />} />
          <Route path="/employee/attendance/attendenceform" element={<AttendanceForm />} />
          <Route path="/employee/applications" element={<Application />} />
          <Route path="/employee/joblist" element={<JobList />} />
        </Route>

        {/* Redirect unknown routes to login */}
        {/* <Route path="/admin/dashboard" element={<Dashboard/>} />
        <Route path="/employee/dashboard" element={<Dashboard/>} />
        <Route path="/visitor/dashboard" element={<Dashboard/>} /> */}
      </Routes>
    </Router>
  );
}

export default App;