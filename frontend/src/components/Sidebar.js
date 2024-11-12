import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';

//icons
import { FaBackward } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import { BsFillCalendar2DateFill } from "react-icons/bs";
import { MdWorkHistory } from "react-icons/md";
import { SiGoogleforms } from "react-icons/si";
import { FaUserSecret } from "react-icons/fa";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { SiReacthookform } from "react-icons/si";
import { FaUserFriends } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { MdLogout } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa6";
import { ImUserPlus } from "react-icons/im";


const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>Menu</h2>
            <ul className='flex flex-col'>
                <li className='flex gap-10 items-center'><MdDashboard /> <Link to="/dashboard">Dashboard</Link></li>
                <li className='flex gap-10 items-center'><BsFillCalendar2DateFill /><Link to="/leaves">Leaves</Link></li>
                <li className='flex gap-10 items-center'><SiGoogleforms /><Link to="/jobs">Jobs</Link></li>
                <li className='flex gap-10 items-center'><MdWorkHistory /><Link to="/applications">Applications</Link></li>
                <li className='flex gap-10 items-center'><FaUserSecret /><Link to="/employee">Employee</Link></li>
                <li className='flex gap-10 items-center'><RiMoneyDollarCircleFill /><Link to="/salary">Salary</Link></li>
                <li className='flex gap-10 items-center'><SiReacthookform /><Link to="/programs">Programs</Link></li>
                <li className='flex gap-10 items-center'><FaUserFriends /><Link to="/clients">Clients</Link></li>
                <li className='flex gap-10 items-center'><FaUserPlus /><Link to="/adduser">Add user</Link></li>
                <li className='flex gap-10 items-center'><ImUserPlus /><Link to="/addEmployee">Add Employee</Link></li>

                <li className='flex gap-10 items-center'><MdLogout /><Link to="/logout">Logout</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;
