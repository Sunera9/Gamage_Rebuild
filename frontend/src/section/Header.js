import React, { useState } from 'react';
import { FaBell, FaUserCircle, FaSearch, FaUser, FaCog, FaListAlt, FaLifeRing, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';  // Import Link from react-router-dom
import gamgelogo from '../assest/img/brand/gamageLogo.jpg';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    console.log(`Searching for: ${searchTerm}`);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen((prevState) => !prevState);
  };

  // Handle Logout
  const handleLogout = () => {
    // Clear local storage or session storage
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Redirect to the login page
    navigate("/login");
  };

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

        {/* Search Bar */}
        <div className="flex flex-1 justify-center">
          <div className="flex items-center bg-gray-100 p-2 rounded-full w-full sm:w-80 md:w-96 lg:w-[500px] shadow-sm">
            <input
              type="text"
              placeholder="Search..."
              className="flex-grow px-4 py-2 bg-transparent border-none outline-none rounded-l-full text-sm text-gray-700"
              value={searchTerm}
              onChange={handleInputChange}
            />
            <button
              className="bg-transparent p-2 rounded-r-full"
              onClick={handleSearch}
            >
              <FaSearch className="text-gray-500 hover:text-blue-500 transition-colors" />
            </button>
          </div>
        </div>

        {/* Icons (Notifications and Profile) */}
        <div className="relative">
          <div className="flex items-center space-x-4">
            <FaBell className="text-gray-500 hover:text-blue-500 cursor-pointer transition-colors" />
            <FaUserCircle
              className="text-gray-500 hover:text-blue-500 cursor-pointer transition-colors"
              onClick={toggleProfileDropdown}
            />
          </div>

          {/* Dropdown Menu */}
          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg">
              <ul className="text-gray-700">
                <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Link to="/profile" className="flex items-center">
                    <FaUser className="mr-2 text-gray-500" />
                    My Profile
                  </Link>
                </li>
                <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Link to="/settings" className="flex items-center">
                    <FaCog className="mr-2 text-gray-500" />
                    Settings
                  </Link>
                </li>
                <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Link to="/activity" className="flex items-center">
                    <FaListAlt className="mr-2 text-gray-500" />
                    Activity
                  </Link>
                </li>
                <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Link to="/support" className="flex items-center">
                    <FaLifeRing className="mr-2 text-gray-500" />
                    Support
                  </Link>
                </li>
                <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                onClick={handleLogout}
                >
                  <Link to="/logout" className="flex items-center">
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;



















// import React, { useState } from 'react';
// import { FaBell, FaUserCircle, FaSearch, FaUser, FaCog, FaListAlt, FaLifeRing, FaSignOutAlt } from 'react-icons/fa';
// import { Link } from 'react-router-dom'; 
// import gamgelogo from '../assest/img/brand/gamageLogo.jpg';

// const Header = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

//   const handleInputChange = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   const handleSearch = () => {
//     console.log(`Searching for: ${searchTerm}`);
//   };

//   const toggleProfileDropdown = () => {
//     setIsProfileDropdownOpen((prevState) => !prevState);
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false); // Set logged-in state to false
//     console.log("Logged out");
//   };

//   return (
//     <div className="w-full bg-white shadow-md fixed top-0 z-50">
//       {/* Header */}
//       <header className="flex justify-between items-center h-16 px-6">
//         {/* Logo and Name */}
//         <div className="flex items-center">
//           <img
//             src={gamgelogo}
//             alt="Gamage Recruiters"
//             className="rounded-full w-12 h-12 mr-4"
//           />
//           <h2 className="text-2xl text-blue-500 font-bold">
//             Gamage Recruiters
//           </h2>
//         </div>

//         {/* Conditional Rendering */}
//         {!isLoggedIn ? (
//           // Render Login/Signup links when not logged in
//           <div className="flex items-center space-x-4">
//             <Link to="/login" className="text-blue-500 hover:text-blue-700 font-semibold">
//               Login
//             </Link>
//             <Link to="/register" className="text-blue-500 hover:text-blue-700 font-semibold">
//               Signup
//             </Link>
//           </div>
//         ) : (
//           // Render the full header when logged in
//           <>
//             {/* Search Bar */}
//             <div className="flex flex-1 justify-center">
//               <div className="flex items-center bg-gray-100 p-2 rounded-full w-full sm:w-80 md:w-96 lg:w-[500px] shadow-sm">
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   className="flex-grow px-4 py-2 bg-transparent border-none outline-none rounded-l-full text-sm text-gray-700"
//                   value={searchTerm}
//                   onChange={handleInputChange}
//                 />
//                 <button
//                   className="bg-transparent p-2 rounded-r-full"
//                   onClick={handleSearch}
//                 >
//                   <FaSearch className="text-gray-500 hover:text-blue-500 transition-colors" />
//                 </button>
//               </div>
//             </div>

//             {/* Icons (Notifications and Profile) */}
//             <div className="relative">
//               <div className="flex items-center space-x-4">
//                 <FaBell className="text-gray-500 hover:text-blue-500 cursor-pointer transition-colors" />
//                 <FaUserCircle
//                   className="text-gray-500 hover:text-blue-500 cursor-pointer transition-colors"
//                   onClick={toggleProfileDropdown}
//                 />
//               </div>

//               {/* Dropdown Menu */}
//               {isProfileDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg">
//                   <ul className="text-gray-700">
//                     <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
//                       <Link to="/profile" className="flex items-center">
//                         <FaUser className="mr-2 text-gray-500" />
//                         My Profile
//                       </Link>
//                     </li>
//                     <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
//                       <Link to="/settings" className="flex items-center">
//                         <FaCog className="mr-2 text-gray-500" />
//                         Settings
//                       </Link>
//                     </li>
//                     <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
//                       <Link to="/activity" className="flex items-center">
//                         <FaListAlt className="mr-2 text-gray-500" />
//                         Activity
//                       </Link>
//                     </li>
//                     <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
//                       <Link to="/support" className="flex items-center">
//                         <FaLifeRing className="mr-2 text-gray-500" />
//                         Support
//                       </Link>
//                     </li>
//                     <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500">
//                       <button onClick={handleLogout} className="flex items-center w-full">
//                         <FaSignOutAlt className="mr-2" />
//                         Logout
//                       </button>
//                     </li>
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </header>
//     </div>
//   );
// };

// export default Header;
