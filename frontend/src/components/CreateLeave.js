import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../section/Header';

export default function CreateLeave() {
  const [leaveDetails, setLeaveDetails] = useState({
    userId: '', // or fetch from user context if logged in
    startDate: '',
    endDate: '',
    type: 'Common', // default value
    reason: '',
    duration: '' // duration is now part of leaveDetails
  });
  const [showModal, setShowModal] = useState(false); // Modal state
  const [message, setMessage] = useState("");

  // Consolidated handleChange for all fields, including duration
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeaveDetails({ ...leaveDetails, [name]: value });
  };

  const handleDurationChange = (e) => {
    setLeaveDetails({ ...leaveDetails, duration: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8070/leaves/add', leaveDetails);
      setMessage(response.data.status);
      setShowModal(true); // Show modal on successful submission
      resetForm();
    } catch (error) {
      setMessage(`Error: ${error.response ? error.response.data.status : error.message}`);
    }
  };

  const resetForm = () => {
    setLeaveDetails({
      userId: '',
      startDate: '',
      endDate: '',
      type: 'Common',
      reason: '',
      duration: ''
    });
  };

  const handleOK = () => {
    setShowModal(false);
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
                <div className="modal" style={{ display: "block" }}>
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Leave Request Submitted</h5>
                      </div>
                      <div className="modal-body">
                        <p>Your leave request has been successfully submitted!</p>
                      </div>
                      <div className="modal-footer">
                        <Link to="/leaves" className="btn btn-primary" onClick={handleOK}>
                          OK
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-semibold text-gray-700 mb-5">Submit a Leave Request</h2>

                <div className="mb-3">
                  <label className="form-label">User ID:</label>
                  <input
                    type="text"
                    name="userId"
                    value={leaveDetails.userId}
                    onChange={handleChange}
                    required
                    className="form-control"
                    placeholder="Enter User ID"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Leave Duration:</label>
                  <div>
                    <label>
                      <input
                        type="radio"
                        name="duration"
                        value="Full Day"
                        checked={leaveDetails.duration === 'Full Day'}
                        onChange={handleDurationChange}
                      />{' '}
                      Full Day
                    </label>
                    <label className="ml-4">
                      <input
                        type="radio"
                        name="duration"
                        value="Half Day"
                        checked={leaveDetails.duration === 'Half Day'}
                        onChange={handleDurationChange}
                      />{' '}
                      Half Day
                    </label>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Start Date:</label>
                  <input
                    type="date"
                    name="startDate"
                    value={leaveDetails.startDate}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">End Date:</label>
                  <input
                    type="date"
                    name="endDate"
                    value={leaveDetails.endDate}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Leave Type:</label>
                  <select
                    name="type"
                    value={leaveDetails.type}
                    onChange={handleChange}
                    required
                    className="form-control"
                  >
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Annual Leave">Annual Leave</option>
                    <option value="Maternity Leave">Maternity Leave</option>
                    <option value="Personal Leave">Personal Leave</option>
                    <option value="Common">Common</option>
                    <option value="Paternity Leave">Paternity Leave</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Reason:</label>
                  <textarea
                    name="reason"
                    value={leaveDetails.reason}
                    onChange={handleChange}
                    required
                    className="form-control"
                    placeholder="Enter reason for leave"
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-100 mt-3">Submit Leave Request</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {message && <p className="mt-3 text-center">{message}</p>}
    </div>
    </>
  );
}
