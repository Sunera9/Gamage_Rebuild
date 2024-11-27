import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import "../styles/AllEmployee.css"

const AllEmployee = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Employee headers
  const employeeColumns = [
    { field: "id", headerName: "ID", width: 200 },

    { field: "email", headerName: "Email", width: 400 },
    { field: "phone", headerName: "Phone", width: 200 },
  ];

  // Action column for update and delete buttons
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 300,
      renderCell: (params) => (
        <div className="flex items-center justify-between">
          <button className="bg-green-500 px-2 ">Update</button>
          <button
            className=" bg-red-600 rounded-sm  px-2  flex items-center justify-center text-center"
            onClick={() => handleDelete(params.row._id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  // Fetch all employee data
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get("http://localhost:8070/users/get");
        setEmployeeData(response.data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };
    fetchEmployeeData();
  }, []);

  // Handle delete functionality
  const handleDelete = async (_id) => {
    console.log("user:", _id);
    try {
      await axios.delete(`http://localhost:8070/users/delete/${_id}`);
      setEmployeeData(employeeData.filter((emp) => emp._id !== _id));
      alert("Employee deleted successfully");
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee");
    }
  };

  // Filter data based on search query
  const filteredEmployeeData = employeeData.filter((employee) =>
    ["_id", "full_name", "email", "phone"].some((field) =>
      employee[field]
        ?.toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="flex flex-col items-center justify-center mt-20  h-[500px] ">
      <h1 className="mb-32"> Get all employees</h1>
      <div>
        {/* <input
          type="text"
          placeholder="Search employees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="searchInput"
        /> */}
      </div>
      <DataGrid
        components={{ Toolbar: GridToolbar }}
        className="w-full"
        rows={filteredEmployeeData.map((row, index) => ({
          ...row,
          id: row._id, // Map MongoDB _id to the id field for DataGrid
        }))}
        columns={employeeColumns.concat(actionColumn)}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
      />
    </div>
  );
};

export default AllEmployee;
