import Sidebar from './components/Sidebar';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddUser from './components/AddUser';
import Dashboard from './page/Dashboard';
import TicketForm from './components/TicketForm';
import CreateLeave from './components/CreateLeave';

function App() {
  return (
    <Router>
      <Sidebar/>
      <div>
        <Routes>

          {/* Users */}
          <Route path="/adduser" element={<AddUser/>}/>
          
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/tickets" element={<TicketForm/>}/>
          <Route path="/leaves" element={<CreateLeave/>}/>




        </Routes>
      </div>
    </Router>
  );
}

export default App;
