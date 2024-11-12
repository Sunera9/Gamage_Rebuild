import Sidebar from "./components/Sidebar";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddUser from "./components/AddUser";
import NewEmployee from "./components/NewEmployee";
import AllEmployee from "./components/AllEmployee";

function App() {
  return (
    <Router>
      <Sidebar />
      <div>
        <Routes>
          {/* Users */}
          <Route path="/adduser" element={<AddUser />} />

          {/* Employee */}
          <Route path="/addEmployee" element={<NewEmployee />} />
          <Route path="/employee" element={<AllEmployee />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
