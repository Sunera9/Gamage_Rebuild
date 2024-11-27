import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/Ticket.css';
import Header from '../section/Header';

export default function TicketForm() {
  const [userID, setUserID] = useState('');
  const [description, setDescription] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false); // Modal state
  const [ticketID, setTicketID] = useState(null); // Store ticket ID
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    // Validate file type and size
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (!allowedTypes.includes(selectedFile.type)) {
      alert('Invalid file type. Please upload a PDF, JPEG, or PNG file.');
      return;
    }
    if (selectedFile.size > maxSize) {
      alert('File size exceeds 5MB. Please upload a smaller file.');
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    // Ensure that a file is selected if it's required based on leave type

    if ((leaveType === 'Educational' || leaveType === 'Medical') && !file) {
      alert('Please upload a file for the selected leave type.');
      return;
    }

    const formData = new FormData();
    // formData.append('userID', userID);
    formData.append('description', description);
    formData.append('leaveType', leaveType);
    if (file) {
      formData.append('file', file);
    }

    setIsLoading(true); // Set loading to true
    try {
      const response = await axios.post('http://localhost:8070/tickets/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setTicketID(response.data.ticket._id); // Capture ticket ID from response

      setShowModal(true); // Show success modal
      resetForm(); // Reset the form fields
    } catch (error) {
      console.error('Error submitting ticket:', error);
      alert('Failed to submit ticket. Please try again.');
    } finally {
      setIsLoading(false); // Set loading to false
    }
  };

  const resetForm = () => {
    setUserID('');
    setDescription('');
    setLeaveType('');
    setFile(null);
  };

  const handleOK = () => {
    setShowModal(false); // Close modal
  };

  return (
    <>
    <Header/>
    <div className="container-ticket">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              {showModal && (
                <div className="modal" style={{ display: 'block' }}>
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Ticket Submitted</h5>
                      </div>
                      <div className="modal-body">
                        <p>Your ticket has been successfully submitted!</p>
                        {ticketID && <p><strong>Ticket ID:</strong> {ticketID}</p>}
                      </div>
                      <div className="modal-footer">
                        <Link to="/tickets" className="btn btn-primary" onClick={handleOK}>
                          OK
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-semibold text-gray-700 mb-5">Create a Ticket</h2>

                {/* <div className="mb-3">
                  <label className="form-label">User ID:</label>
                  <input
                    type="text"
                    value={userID}
                    onChange={(e) => setUserID(e.target.value)}
                    required
                    className="form-control"
                    placeholder="Enter User ID"
                  />
                </div> */}

                <div className="mb-3">
                  <label className="form-label">Description:</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="form-control"
                    placeholder="Enter description"
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">Leave Type:</label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    required
                    className="form-control"
                  >
                    <option value="">Select leave type</option>
                    <option value="Personal">Personal</option>
                    <option value="Educational">Educational</option>
                    <option value="Medical">Medical</option>
                  </select>
                </div>

                {(leaveType === 'Educational' || leaveType === 'Medical') && (
                  <div className="mb-3">
                    <label className="form-label">Upload File:</label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="form-control"
                      required
                    />
                    {file && (
                      <div className="mt-2 text-sm text-gray-700">
                        <strong>Selected File:</strong> {file.name}
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-100 mt-3"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );

};


