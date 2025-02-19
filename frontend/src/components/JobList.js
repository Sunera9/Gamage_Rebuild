import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch jobs from the backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/jobs`
        );
        setJobs(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load jobs. Please try again.");
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Handle Apply button click
  const handleApply = async (jobId, jobName) => {
    try {
      const userEmail = localStorage.getItem("userEmail");

      if (!userEmail) {
        console.error("User is not logged in.");
        return;
      }

      const userResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/users/getByEmail/${userEmail}`
      );
      const userData = userResponse.data;

      navigate(`/employee/apply/${jobId}`, {
        state: {
          userName: userData.user.name,
          userNIC: userData.user.nic,
          userEmail: userData.user.email,
          contactNumber: userData.user.phone,
          userAddress: userData.user.address,
          jobId: jobId,
          jobName: jobName,
        },
      });
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  return (
    <Container sx={{ marginTop: 6, display: "flex", justifyContent: "center" }}>
      <Grid container spacing={3} direction="column" alignItems="center">
        <Typography variant="h4" gutterBottom align="center">
          Available Jobs
        </Typography>
        {loading && (
          <Grid container justifyContent="center" sx={{ marginTop: 3 }}>
            <CircularProgress />
          </Grid>
        )}
        {error && (
          <Alert severity="error" sx={{ marginTop: 3 }}>
            {error}
          </Alert>
        )}
        {!loading && !error && jobs.length === 0 && (
          <Typography variant="h6" align="center" sx={{ marginTop: 3 }}>
            No jobs available at the moment.
          </Typography>
        )}
        {!loading && jobs.length > 0 && (
          <Grid
            container
            spacing={3}
            sx={{ marginTop: 3 }}
            justifyContent="center"
          >
            {jobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job._id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between", // Ensure content is spaced
                    "&:hover": {
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {job.jobTitle}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Company:</strong> {job.companyName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Location:</strong> {job.location}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ marginTop: 1 }}
                    >
                      <strong>Description:</strong> {job.jobDescription}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ marginTop: 1 }}
                    >
                      <strong>Requirements:</strong>{" "}
                      {job.requirements.join(", ")}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ marginTop: 1 }}
                    >
                      <strong>Type:</strong> {job.jobType}
                    </Typography>
                  </CardContent>
                  <CardActions
                    sx={{ justifyContent: "center", paddingBottom: 2 }}
                  >
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => handleApply(job._id, job.jobTitle)}
                    >
                      Apply
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default JobList;
