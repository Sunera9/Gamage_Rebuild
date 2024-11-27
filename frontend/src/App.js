import { useState } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route , Navigate} from "react-router-dom";
import Dashboard from './page/Dashboard';
import TicketForm from './components/TicketForm';
import CreateLeave from './components/CreateLeave';
import Login from "./page/Login";
import Register from "./page/Register";
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

           {/* Nested Routes for Dashboard */}
          {/* Users */}
          <Route path="/profile" element={<Profile />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tickets" element={<TicketForm />} />
          <Route path="/TicketsTable" element={<TicketsTable />} />
          <Route path="/LeavesTable" element={<LeavesTable />} />
          <Route path="/programs" element={<Program />} />
          <Route path="/leaves" element={<CreateLeave />} />         
          <Route path="/tickets" element={<TicketForm />} />
          <Route path="/applications" element={<Application/>} />
          <Route path="/employee" element={<AllEmployee />} />
          <Route path="/salary/sheet" element={<Salary/>}/>
          <Route path="/salary/settings" element={<SettingsPage/>}/>
          <Route path="/slip/:userId/:month/:year" element={<SalarySlip/>} />
          <Route path="/setting" element={<SettingsPage/>}/>
          
          
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
