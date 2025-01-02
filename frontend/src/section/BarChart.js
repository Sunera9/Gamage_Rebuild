import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", Applications: 80, Shortlisted: 60, Rejected: 20 },
  { name: "Tue", Applications: 90, Shortlisted: 70, Rejected: 20 },
  { name: "Wed", Applications: 100, Shortlisted: 80, Rejected: 20 },
  { name: "Thu", Applications: 70, Shortlisted: 50, Rejected: 20 },
  { name: "Fri", Applications: 85, Shortlisted: 65, Rejected: 20 },
  { name: "Sat", Applications: 95, Shortlisted: 75, Rejected: 20 },
  { name: "Sun", Applications: 80, Shortlisted: 60, Rejected: 20 },
];

const BarChart = () => {
  return (
    <div className="flex items-center justify-end pr-[30%]">
      <div className="w-3/4 p-4 bg-white rounded-lg">
        <h3 className="text-lg items-center justify-end font-semibold mb-4">Statistics of Active Applicants</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsBarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Applications" fill="#4CAF50" />
            <Bar dataKey="Shortlisted" fill="#FF9800" />
            <Bar dataKey="Rejected" fill="#F44336" />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChart;
