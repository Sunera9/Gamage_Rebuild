import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>Menu</h2>
            <ul>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/leaves">Leaves</Link></li>
                <li><Link to="/jobs">Jobs</Link></li>
                <li><Link to="/applications">Applications</Link></li>
                <li><Link to="/employee">Employee</Link></li>
                <li><Link to="/salary">Salary</Link></li>
                <li><Link to="/programs">Programs</Link></li>
                <li><Link to="/clients">Clients</Link></li>
                <li><Link to="/adduser">Add user</Link></li>
                <li><Link to="/logout">Logout</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;
