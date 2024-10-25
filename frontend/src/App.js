import Sidebar from './components/Sidebar';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddUser from './components/AddUser';
import Dashboard from './page/Dashboard';


function App() {
  return (
    <Router>
      <Sidebar/>
      <div>
        <Routes>

          {/* Users */}
          <Route path="/adduser" element={<AddUser/>}/>
          
          <Route path="/dashboard" element={<Dashboard/>}/>


        </Routes>
      </div>
    </Router>
  );
}

export default App;
