import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>Menu</h2>
            <ul>
                <li><a href="#dashboard">Dashboard</a></li>
                <li><a href="#leaves">Leaves</a></li>
                <li><a href="#jobs">Jobs</a></li>
                <li><a href="#applications">Applications</a></li>
                <li><a href="#employee">Employee</a></li>
                <li><a href="#salary">Salary</a></li>
                <li><a href="#programs">Programs</a></li>
                <li><a href="#clients">Clients</a></li>
                <li><a href="#profile">Profile</a></li>
                <li><a href="#logout">Logout</a></li>
            </ul>
        </div>
    );
};

export default Sidebar;
