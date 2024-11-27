import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import "./App.css";
import AddUser from "./components/AddUser";
import Dashboard from "./page/Dashboard";
import TicketForm from "./components/TicketForm";
import CreateLeave from "./components/CreateLeave";
import Login from "./page/Login";
import Register from "./page/Register";
import Layout_1 from "./layouts/Layout_1";
import NewEmployee from "./components/NewEmployee";
import AllEmployee from "./components/AllEmployee";
import TicketsTable from "./components/manageTicket";
import LeavesTable from "./components/leaveManage";
import Program from "./components/Program";
import AddJob from "./components/AddJob";
import JobList from "./components/JobList";
import ApplicationForm from "./components/ApplicationForm";

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
          <Route path="adduser" element={<AddUser />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tickets" element={<TicketForm />} />
          <Route path="TicketsTable" element={<TicketsTable />} />
          <Route path="LeavesTable" element={<LeavesTable />} />
          <Route path="programs" element={<Program />} />
          <Route path="leaves" element={<CreateLeave />} />
          <Route path="addEmployee" element={<NewEmployee />} />
          <Route path="employee" element={<AllEmployee />} />
          <Route path="/addjob" element={<AddJob />} />
          <Route path="/joblist" element={<JobList />} />
          <Route path="/apply/:jobId" element={<ApplicationForm/>} />
        </Route>

    
        
      </Routes>
    </Router>
  );
}

export default App;
