import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";

const AllEmployee = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(5); // Default page size

  const employeeColumns = [
    { field: "id", headerName: "ID", width: 200 },
    { field: "name", headerName: "Name", width: 300 },
    { field: "email", headerName: "Email", width: 300 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "startDate", headerName: "Start Date", width: 200 },
    { field: "endDate", headerName: "End Date", width: 200 },
  ];

  
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="flex gap-4">
          <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition">
            Update
          </button>
          <button
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
            onClick={() => handleDelete(params.row._id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  
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
  }, []); // Initial data fetch

  
  const handleDelete = async (_id) => {
    try {
      await axios.delete(`http://localhost:8070/users/delete/${_id}`);
      setEmployeeData(employeeData.filter((emp) => emp._id !== _id));
      alert("Employee deleted successfully");
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee");
    }
  };

 
  const filteredEmployeeData = employeeData.filter((employee) =>
    ["_id", "name", "email", "phone", "startDate", "endDate"].some((field) =>
      employee[field]?.toString().toLowerCase().includes(searchQuery.toLowerCase()) // Making the search case-insensitive
    )
  );

  
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString(); 
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Employee Directory</h1>
      <div className="w-full max-w-4xl mb-4">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="w-full max-w-6xl bg-white rounded shadow p-4">
        <DataGrid
          components={{ Toolbar: GridToolbar }}
          className="h-[500px]"
          rows={filteredEmployeeData.map((row) => ({
            ...row,
            id: row._id, 
            startDate: formatDate(row.startDate), 
            endDate: formatDate(row.endDate),
          }))}
          columns={employeeColumns.concat(actionColumn)}
          pageSize={pageSize} 
          rowsPerPageOptions={[5, 10, 15]} 
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)} 
          pagination
          checkboxSelection
        />
      </div>
    </div>
  );
};

export default AllEmployee;
