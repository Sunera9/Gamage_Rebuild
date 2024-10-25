import React, { useState } from 'react';
import { FaBell, FaUserCircle, FaSearch } from 'react-icons/fa';
import '../styles/Header.css';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    console.log(`Searching for: ${searchTerm}`);
  };

  return (
    <div>
    <div className="container-header">
      <header className="header">
        <div className="flex-1 flex justify-center">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
              value={searchTerm}
              onChange={handleInputChange}
            />
            <button className="search-button" onClick={handleSearch}>
              <FaSearch className="search-icon" />
            </button>
          </div>
        </div>
        <div className="flex-none flex justify-end items-center space-x-4">
          <FaBell className="icon-header notification-icon" />
          <FaUserCircle className="icon-header profile-icon" />
        </div>
        
      </header> 
    </div>
   
   </div>
  );
};

export default Header;
