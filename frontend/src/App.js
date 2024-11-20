import Sidebar from './components/Sidebar';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddUser from './components/AddUser';
import Dashboard from './page/Dashboard';
import TicketForm from './components/TicketForm';
import CreateLeave from './components/CreateLeave';

import TicketsTable from './components/manageTicket';
import LeavesTable from './components/leaveManage';
import Program from './components/Program';


function App() {
  return (
    <Router>
      <Sidebar />
      <div>
        <Routes>
          {/* Users */}
          <Route path="/adduser" element={<AddUser />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tickets" element={<TicketForm />} />

          <Route path="/TicketsTable" element={<TicketsTable />} />

          <Route path="/LeavesTable" element={<LeavesTable />} />

          <Route path="/programs" element={<Program />} />

          <Route path="/leaves" element={<CreateLeave />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
