import React, { useState } from "react";
import { Link } from "react-router-dom";
import gamgelogo from "../assest/img/brand/gamageLogo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faFile,
  faBriefcase,
  faClipboardList,
  faUser,
  faDollarSign,
  faTicketAlt,
  faSignOutAlt,
  faAngleLeft,
  faAngleRight,
  faChevronDown,
  faClock,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isSalaryOpen, setIsSalaryOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false); // State for the Attendance dropdown
  //const user = useSelector((state) => state.auth.user);

  //const userRole = localStorage.getItem('role'); // Get role from localStorage

  //const isEmployee = user?.role === 'employee';
  //const isAdmin = user?.role === 'admin';
  //const isVisitor = user?.role === 'visitor'

  const user = JSON.parse(localStorage.getItem("user")); // Parse the user object
  const userRole = user?.role; // Safely access the role

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleSalaryMenu = () => {
    setIsSalaryOpen(!isSalaryOpen);
  };

  const toggleAttendanceMenu = () => {
    setIsAttendanceOpen(!isAttendanceOpen); // Toggle Attendance dropdown
  };

  return (
    <div
      className={`fixed top-10 left-0 h-full bg-white text-black p-10 transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-16"
      } overflow-y-auto`} // Added overflow-y-auto here
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          <ul className="space-y-10">
            {userRole === "admin" && (
              <li>
                {/*dashboard can view visitor,employee, admin */}
                <Link
                  to="/dashboard"
                  className="flex items-center text-lg font-bold text-black hover:text-yellow-400"
                >
                  <FontAwesomeIcon
                    icon={faHome}
                    className="mr-3 text-yellow-500"
                  />
                  {isOpen && "Dashboard"}
                </Link>
              </li>
            )}

            {userRole === "employee" && (
              <li>
                <Link
                  to="/employee/leaves"
                  className="flex items-center text-lg font-bold text-black hover:text-yellow-400"
                >
                  <FontAwesomeIcon
                    icon={faFile}
                    className="mr-3 text-orange-500"
                  />
                  {isOpen && "Leaves"}
                </Link>
              </li>
            )}
            {userRole === "admin" && (
              <li>
                <Link
                  to="/admin/LeavesTable"
                  className="flex items-center text-lg font-bold text-black hover:text-yellow-400"
                >
                  <FontAwesomeIcon
                    icon={faFile}
                    className="mr-3 text-orange-500"
                  />
                  {isOpen && "Leaves"}
                </Link>
              </li>
            )}

            {/* {userRole === "employee" && (
              <li>
                <Link
                  to="/employee/joblist"
                  className="flex items-center text-lg font-bold text-black hover:text-yellow-400"
                >
                  <FontAwesomeIcon
                    icon={faBriefcase}
                    className="mr-3 text-blue-500"
                  />
                  {isOpen && "Jobs"}
                </Link>
              </li>
            )} */}
            {userRole === "admin" && (
              <li>
                <Link
                  to="/admin/addjob"
                  className="flex items-center text-lg font-bold text-black hover:text-yellow-400"
                >
                  <FontAwesomeIcon
                    icon={faBriefcase}
                    className="mr-3 text-blue-500"
                  />
                  {isOpen && "Jobs"}
                </Link>
              </li>
            )}

            {userRole === "admin" && (
              <li>
                <Link
                  to="/admin/recruite"
                  className="flex items-center text-lg font-bold text-black hover:text-yellow-400"
                >
                  <FontAwesomeIcon
                    icon={faUserPlus}
                    className="mr-3 text-blue-500"
                  />
                  {isOpen && "Recruit"}
                </Link>
              </li>
            )}

            {userRole === "employee" && (
              <li>
                <Link
                  to="/employee/applications"
                  className="flex items-center text-lg font-bold text-black hover:text-yellow-400"
                >
                  <FontAwesomeIcon
                    icon={faClipboardList}
                    className="mr-3 text-gray-500"
                  />
                  {isOpen && "Applications"}
                </Link>
              </li>
            )}
            {userRole === "admin" && (
              <li>
                <Link
                  to="/admin/applications"
                  className="flex items-center text-lg font-bold text-black hover:text-yellow-400"
                >
                  <FontAwesomeIcon
                    icon={faClipboardList}
                    className="mr-3 text-gray-500"
                  />
                  {isOpen && "Applications"}
                </Link>
              </li>
            )}

            {/* Salary Dropdown */}
            <li>
              {userRole === "admin" && (
                <div
                  onClick={toggleSalaryMenu}
                  className="flex items-center cursor-pointer text-lg font-bold text-black hover:text-yellow-400"
                >
                  <FontAwesomeIcon
                    icon={faDollarSign}
                    className="mr-3 text-green-500"
                  />
                  {isOpen && <p>Salary</p>}
                  {isOpen && (
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`ml-auto transition-transform ${
                        isSalaryOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              )}
              {userRole === "employee" && (
                <div
                  onClick={toggleSalaryMenu}
                  className="flex items-center cursor-pointer text-lg font-bold text-black hover:text-yellow-400"
                >
                  <FontAwesomeIcon
                    icon={faDollarSign}
                    className="mr-3 text-green-500"
                  />
                  {isOpen && <p>Salary</p>}
                  {isOpen && (
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`ml-auto transition-transform ${
                        isSalaryOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              )}
              {isSalaryOpen && (
                <ul className="ml-6 space-y-2 mt-2">
                  {userRole === "admin" && (
                    <li>
                      <Link
                        to="/admin/salary/sheet"
                        className="text-base font-bold text-black hover:text-yellow-400"
                      >
                        {isOpen && "Salary Sheet"}
                      </Link>
                    </li>
                  )}
                  {userRole === "admin" && (
                    <li>
                      <Link
                        to="/admin/salary/settings"
                        className="text-base font-bold text-black hover:text-yellow-400"
                      >
                        {isOpen && "Salary Settings"}
                      </Link>
                    </li>
                  )}
                  {userRole === "employee" && (
                    <li>
                      <Link
                        to="/employee/salary/sheet"
                        className="text-base font-bold text-black hover:text-yellow-400"
                      >
                        {isOpen && "Salary Sheet"}
                      </Link>
                    </li>
                  )}
                </ul>
              )}
            </li>
            {userRole === "employee" && (
              <li>
                <Link
                  to="/employee/tickets"
                  className="flex items-center text-lg font-bold text-black hover:text-yellow-400"
                >
                  <FontAwesomeIcon
                    icon={faTicketAlt}
                    className="mr-3 text-blue-500"
                  />
                  {isOpen && "Tickets"}
                </Link>
              </li>
            )}
            {userRole === "admin" && (
              <li>
                <Link
                  to="/admin/TicketsTable"
                  className="flex items-center text-lg font-bold text-black hover:text-yellow-400"
                >
                  <FontAwesomeIcon
                    icon={faTicketAlt}
                    className="mr-3 text-blue-500"
                  />
                  {isOpen && "Tickets"}
                </Link>
              </li>
            )}
            <li>
              {userRole === "visitor" && (
                <Link
                  to="/employee/joblist"
                  className="flex items-center text-lg font-bold text-black hover:text-yellow-400"
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    className="mr-3 text-blue-500"
                  />
                  {isOpen && "Job Vacancies"}
                </Link>
              )}
            </li>

            <li>
              {/*profile can view admin,employee,visitor */}
              <Link
                to="/profile"
                className="flex items-center text-lg font-bold text-black hover:text-yellow-400"
              >
                <FontAwesomeIcon icon={faUser} className="mr-3 text-blue-500" />
                {isOpen && "Profile"}
              </Link>
            </li>
            {/* Attendance Dropdown */}
            <li>
              {userRole === "employee" && (
                <div
                  onClick={toggleAttendanceMenu}
                  className="flex items-center cursor-pointer text-lg font-bold text-black hover:text-yellow-400"
                >
                  <FontAwesomeIcon
                    icon={faClock}
                    className="mr-3 text-purple-500"
                  />
                  {isOpen && "Attendance"}
                  {isOpen && (
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`ml-auto transition-transform ${
                        isAttendanceOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              )}
              {userRole === "admin" && (
                <div
                  onClick={toggleAttendanceMenu}
                  className="flex items-center cursor-pointer text-lg font-bold text-black hover:text-yellow-400"
                >
                  <FontAwesomeIcon
                    icon={faClock}
                    className="mr-3 text-purple-500"
                  />
                  {isOpen && "Attendance"}
                  {isOpen && (
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`ml-auto transition-transform ${
                        isAttendanceOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              )}
              {isAttendanceOpen && (
                <ul className="ml-6 space-y-2 mt-2">
                  {userRole === "employee" && (
                    <li>
                      <Link
                        to="/employee/attendance/attendenceform"
                        className="text-lg font-bold text-black hover:text-yellow-400"
                      >
                        {isOpen && "Attendance Form"}
                      </Link>
                    </li>
                  )}
                  {userRole === "admin" && (
                    <li>
                      <Link
                        to="/admin/attendance/adminattendence"
                        className="text-base font-bold text-black hover:text-yellow-400"
                      >
                        {isOpen && "Admin Attendence"}
                      </Link>
                    </li>
                  )}
                  {userRole === "admin" && (
                    <li>
                      <Link
                        to="/admin/attendance/attendencerecords"
                        className="text-base font-bold text-black hover:text-yellow-400"
                      >
                        {isOpen && "Attendance Records"}
                      </Link>
                    </li>
                  )}
                </ul>
              )}
            </li>
            {/* <li>
                            <Link
                                to="/logout"
                                className="flex items-center text-lg font-bold text-black hover:text-yellow-400"
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 text-red-500" />
                                {isOpen && 'Logout'}
                            </Link>
                        </li> */}
          </ul>
        </div>
        {/* Placeholder for footer or other content if needed */}
        <div className="mt-auto"></div>
      </div>
    </div>
  );
};

export default Sidebar;
