import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";

const ApplicationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userName, userNIC, userEmail, contactNumber, userAddress, jobId, jobName } = location.state || {};

  const [formData, setFormData] = useState({
    userName: userName || "",
    userNIC: userNIC || "",
    userEmail: userEmail || "",
    contactNumber: contactNumber || "",
    userAddress: userAddress || "",
    jobId: jobId || "",
    jobName: jobName || "",
    coverLetter: "",
    resume: "",
  });

  const [openDialog, setOpenDialog] = useState(false); // Dialog state

  if (!userName || !userNIC || !userEmail || !contactNumber || !userAddress || !jobId || !jobName) {
    return <div>Loading...</div>;
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8070/api/applications", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setOpenDialog(true); // Open success dialog
    } catch (error) {
      console.error("Error submitting the form:", error.response?.data || error.message);
      alert("Failed to submit the application. Please try again.");
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle dialog close and redirect
  const handleDialogClose = () => {
    setOpenDialog(false);
    navigate("/joblist"); // Navigate to job list
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 5 }}>
      <Paper elevation={4} sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Job Application Form
        </Typography>
        <Typography variant="h6" gutterBottom align="center" sx={{ color: "#1976d2" }}>
          Applying for: {jobName}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="User Name"
                variant="outlined"
                name="userName"
                value={formData.userName}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="User NIC"
                variant="outlined"
                name="userNIC"
                value={formData.userNIC}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="User Email"
                variant="outlined"
                name="userEmail"
                value={formData.userEmail}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="User Contact"
                variant="outlined"
                name="contactNumber"
                value={formData.contactNumber}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="User Address"
                variant="outlined"
                name="userAddress"
                value={formData.userAddress}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Cover Letter (Optional)"
                variant="outlined"
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Resume (Optional)"
                variant="outlined"
                name="resume"
                value={formData.resume}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>
            <input type="hidden" name="jobName" value={formData.jobName} />
            <Grid item xs={12}>
              <Button
                variant="contained"
                type="submit"
                fullWidth
                sx={{ padding: "10px 0", backgroundColor: "#1976d2" }}
              >
                Submit Application
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Success Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Application Submitted</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your application for the <strong>{jobName}</strong> position has been successfully submitted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary" variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ApplicationForm;
