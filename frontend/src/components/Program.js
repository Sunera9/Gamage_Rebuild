import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Program.css';

function InternshipProgram() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false); // State to control the modal visibility
  const [modalMessage, setModalMessage] = useState(''); // State to store modal message

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8070/users/get');
        const filteredUsers = response.data.filter(user => user.jobPosition);
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleEmail = async (user) => {
    try {
      // Check if the user already received an email
      const statusResponse = await axios.get(`http://localhost:8070/send-email/check-status/${user._id}`);

      if (statusResponse.data.emailSent) {
        setModalMessage(`Email already sent to ${user.name}`);
        setShowModal(true); // Show the modal if email has been sent
      } else {
        // Send the email if it hasn't been sent before
        const sendResponse = await axios.post('http://localhost:8070/send-email', { userId: user._id });
        console.log(`Email sent successfully to ${user.name}`);
      }
    } catch (error) {
      console.error(`Error handling email for user ${user.name}`, error);
    }
  };

  const closeModal = () => {
    setShowModal(false); // Close the modal
  };

  return (
    <div className="internship-program">
      <div className="title">
        <h2>Internship Program</h2>
      </div>

      <table className="program-table">
        <thead>
          <tr>
            <th>NIC</th>
            <th>Full Name</th>
            <th>Job Position</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.nic}</td>
              <td>{user.name}</td>
              <td>{user.jobPosition ? user.jobPosition.title : 'N/A'}</td>
              <td>{user.startDate ? new Date(user.startDate).toLocaleDateString() : 'N/A'}</td>
              <td>{user.endDate ? new Date(user.endDate).toLocaleDateString() : 'N/A'}</td>
              <td>
                <button onClick={() => handleEmail(user)} title="Send Email">
                  ✉️ {/* or use an icon library here */}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for email sent notification */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>{modalMessage}</p>
            <button onClick={closeModal}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default InternshipProgram;
