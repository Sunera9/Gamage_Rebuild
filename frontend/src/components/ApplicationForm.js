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
    resume: null,
  });

  const [openDialog, setOpenDialog] = useState(false);

  if (!userName || !userNIC || !userEmail || !contactNumber || !userAddress || !jobId || !jobName) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/applications`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setOpenDialog(true);
    } catch (error) {
      console.error("Error submitting the form:", error.response?.data || error.message);
      alert("Failed to submit the application. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({ ...prevData, resume: e.target.files[0] }));
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    navigate("/employee/joblist");
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
              <TextField fullWidth label="User Name" variant="outlined" value={formData.userName} InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="User NIC" variant="outlined" value={formData.userNIC} InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="User Email" variant="outlined" value={formData.userEmail} InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="User Contact" variant="outlined" value={formData.contactNumber} InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="User Address" variant="outlined" value={formData.userAddress} InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Cover Letter (Optional)" variant="outlined" name="coverLetter" value={formData.coverLetter} onChange={handleChange} multiline rows={4} />
            </Grid>
            <Grid item xs={12}>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" type="submit" fullWidth sx={{ padding: "10px 0", backgroundColor: "#1976d2" }}>
                Submit Application
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Application Submitted</DialogTitle>
        <DialogContent>
          <DialogContentText>Your application for <strong>{jobName}</strong> has been submitted successfully.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary" variant="contained">OK</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ApplicationForm;
