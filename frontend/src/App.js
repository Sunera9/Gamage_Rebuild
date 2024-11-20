import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from './components/Sidebar';
import './App.css';
import AddUser from './components/AddUser';
import Dashboard from './page/Dashboard';
import TicketForm from './components/TicketForm';
import CreateLeave from './components/CreateLeave';
import Login from './page/Login';
import Register from './page/Register';
import Layout_1 from './layouts/Layout_1';
import NewEmployee from './components/NewEmployee';
import AllEmployee from './components/AllEmployee';

// Authentication wrapper component
const RequireAuth = ({ children }) => {
  const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  const [user, setLoginUser] = useState({});

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login setLoginUser={setLoginUser} />} />
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
          <Route path="/addEmployee" element={<NewEmployee />} />
          <Route path="/employee" element={<AllEmployee />} />
        </Route>

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
