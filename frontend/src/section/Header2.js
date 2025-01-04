import React from 'react';
import { Link } from 'react-router-dom'; 
import gamgelogo from '../assest/img/brand/gamageLogo.jpg';
import Project from '../page/Project';

const Header = () => {
  return (
    <div className="w-full bg-white shadow-md fixed top-0 z-50">
      {/* Header */}
      <header className="flex justify-between items-center h-16 px-6">
        {/* Logo and Name */}
        <div className="flex items-center">
          <img
            src={gamgelogo}
            alt="Gamage Recruiters"
            className="rounded-full w-12 h-12 mr-4"
          />
          <h2 className="text-2xl text-blue-500 font-bold">
            Gamage Recruiters
          </h2>
        </div>
        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          <Link to="/project" className="text-blue-500 hover:text-blue-700 font-semibold" >
            Project
          </Link>
          <Link to="/about-us" className="text-blue-500 hover:text-blue-700 font-semibold">
            About Us
          </Link>
          <Link to="/login" className="text-blue-500 hover:text-blue-700 font-semibold">
            Login
          </Link>
          <Link to="/register" className="text-blue-500 hover:text-blue-700 font-semibold">
            Signup
          </Link>
        </div>
      </header>
    </div>
  );
};

export default Header;
