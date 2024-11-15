import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Program.css'; 

function InternshipProgram() {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get('http://localhost:8070/programs/get'); 
        setPrograms(response.data);
      } catch (error) {
        console.error('Error fetching programs:', error);
      }
    };

    fetchPrograms();
  }, []);

  return (
    <div className="internship-program">
      
      <div className="title">
      <h2>Internship Program</h2>
      </div>
     
      <table className="program-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Position</th>
            <th>Starting Date</th>
            <th>Ending Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {programs.map((program) => (
            <tr key={program._id}>
              <td>{program.pid}</td>
              <td>{program.fname}</td>
              <td>{program.position}</td>
              <td>{program.sdate}</td>
              <td>{program.edate}</td>
              <td>
              <button onClick={() => handleEmail(program._id)} title="Send Email">
                  ✉️ {/* or use an icon library here */}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const handleEmail = (id) => {
  // Logic for handling email action
  console.log(`Send email to program with ID: ${id}`);
};


export default InternshipProgram;
