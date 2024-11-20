import Sidebar from './components/Sidebar';
import './App.css';
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddUser from './components/AddUser';
import Dashboard from './page/Dashboard';
import TicketForm from './components/TicketForm';
import CreateLeave from './components/CreateLeave';
import Login from './page/Login';
import Register from './page/Register';
import Layout_1 from './layouts/Layout_1';
import NewEmployee from './components/NewEmployee';
import AllEmployee from './components/AllEmployee';

// requiring authentication
const RequireAuth = ({ children }) => {
  const user = localStorage.getItem("user");
  return user ? children : <Login to="/login" replace={true} />;
};

function App() {


  const [user, setLoginUser] = useState({});

  return (
    <Router>
      <div className="ml-64">
      <div>
        <Routes>
        <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Wrap nested routes inside Layout_1 */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <Layout_1 />
              </RequireAuth>
            }
          >
          {/* Users */}
          <Route path="/adduser" element={<AddUser/>}/>
          
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/tickets" element={<TicketForm/>}/>
          <Route path="/leaves" element={<CreateLeave/>}/>
          <Route path="/addEmployee" element={<NewEmployee />} />
          <Route path="/employee" element={<AllEmployee />} />


          </Route>
        </Routes>
      </div>
      </div>
    </Router>
  );
}

export default App;
