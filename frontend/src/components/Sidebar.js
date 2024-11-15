import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';
import gamgelogo from '../assest/img/brand/gamageLogo.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome,
    faFile,
    faBriefcase,
    faClipboardList,
    faUser,
    faDollarSign,
    faUsers,
    faFolder,
    faSignOutAlt,
    faAngleLeft,
    faAngleRight,
    faTicketAlt
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`sidebar ${isOpen ? '' : 'closed'}`}>
            <div className="header">
                <div className="logo-container">
                    <img src={gamgelogo} alt="Gamage Recruiters" className="rounded-logo" />
                    {isOpen && <h2 className="logo-text">Gamage Recruiters</h2>}
                </div>
                <button className="toggle-button" onClick={toggleSidebar}>
                    <div className="circle-icon">
                        {isOpen ? (
                            <FontAwesomeIcon icon={faAngleLeft} className="arrow-icon" />
                        ) : (
                            <FontAwesomeIcon icon={faAngleRight} className="arrow-icon" />
                        )}
                    </div>
                </button>
            </div>
            <ul>
                <li>
                    <Link to="/dashboard" className="link-text">
                        <FontAwesomeIcon icon={faHome} className="icon" style={{ color: 'blue' }}/>
                        {isOpen && 'Dashboard'}
                    </Link>
                </li>
                <li>
                    <Link to="/leaves" className="link-text">
                        <FontAwesomeIcon icon={faFile} className="icon" style={{ color: 'orange' }}/>
                        {isOpen && 'Leaves'}
                    </Link>
                </li>
                <li>
                    <Link to="/jobs" className="link-text">
                        <FontAwesomeIcon icon={faBriefcase} className="icon" style={{ color: 'blue' }}/>
                        {isOpen && 'Jobs'}
                    </Link>
                </li>
                <li>
                    <Link to="/applications" className="link-text">
                        <FontAwesomeIcon icon={faClipboardList} className="icon" style={{ color: 'gray' }}/>
                        {isOpen && 'Applications'}
                    </Link>
                </li>
                <li>
                    <Link to="/employee" className="link-text">
                        <FontAwesomeIcon icon={faUser} className="icon" style={{ color: 'skyblue' }}/>
                        {isOpen && 'Employee'}
                    </Link>
                </li>
                <li>
                    <Link to="/salary" className="link-text">
                        <FontAwesomeIcon icon={faDollarSign} className="icon" style={{ color: 'darkgreen' }}/>
                        {isOpen && 'Salary'}
                    </Link>
                </li>
                <li>
                    <Link to="/programs" className="link-text">
                        <FontAwesomeIcon icon={faFolder} className="icon" style={{ color: 'maroon' }}/>
                        {isOpen && 'Programs'}
                    </Link>
                </li>
                <li>
                    <Link to="/tickets" className="link-text">
                        <FontAwesomeIcon icon={faTicketAlt} className="icon" style={{ color: 'ace' }}/>
                        {isOpen && 'Tickets'}
                    </Link>
                </li>
                <li>
                    <Link to="/clients" className="link-text">
                        <FontAwesomeIcon icon={faUsers} className="icon" style={{ color: 'darkblue' }}/>
                        {isOpen && 'Clients'}
                    </Link>
                </li>
                <li>
                    <Link to="/adduser" className="link-text">
                        <FontAwesomeIcon icon={faUser} className="icon" style={{ color: 'magenta' }}/>
                        {isOpen && 'Profile'}
                    </Link>
                </li>
                <li>
                    <Link to="/logout" className="link-text">
                        <FontAwesomeIcon icon={faSignOutAlt} className="icon" style={{ color: 'red' }}/>
                        {isOpen && 'Logout'}
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
