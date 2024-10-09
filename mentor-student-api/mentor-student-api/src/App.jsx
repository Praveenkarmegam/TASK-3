import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Paper, Typography, Box } from '@mui/material';
import axios from 'axios';
import './App.css'; // Custom CSS file for styling
import Grid from '@mui/material/Grid';

function App() {
  const [mentorName, setMentorName] = useState('');
  const [mentorEmail, setMentorEmail] = useState('');
  const [mentors, setMentors] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [students, setStudents] = useState([]);

  useEffect(() => {
    console.log("Fetching mentors and students...");
    fetchMentors();
    fetchStudents();
  }, []);

  const fetchMentors = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/mentor');
      console.log("Fetched Mentors:", response.data); // Log the fetched data
      setMentors(response.data);
    } catch (error) {
      console.error("Error fetching mentors:", error); // Log any errors
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/student');
      console.log("Fetched Students:", response.data); // Log the fetched data
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error); // Log any errors
    }
  };

  const createMentor = async () => {
    await axios.post('http://localhost:3000/api/mentor', { name: mentorName, email: mentorEmail });
    setMentorName('');
    setMentorEmail('');
    fetchMentors();
  };

  const createStudent = async () => {
    await axios.post('http://localhost:3000/api/student', { name: studentName, email: studentEmail });
    setStudentName('');
    setStudentEmail('');
    fetchStudents();
  };

  return (
    <Container className="app-container">
      <Typography variant="h3" gutterBottom textAlign="center" className="title">
        Mentor-Student Management
      </Typography>

      {/* Mentor Section */}
      <Paper elevation={3} className="form-section">
        <Typography variant="h5" gutterBottom className="form-title">
          Add Mentor
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mentor Name"
              value={mentorName}
              onChange={(e) => setMentorName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mentor Email"
              value={mentorEmail}
              onChange={(e) => setMentorEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={createMentor}
              className="submit-btn"
            >
              Create Mentor
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Student Section */}
      <Paper elevation={3} className="form-section">
        <Typography variant="h5" gutterBottom className="form-title">
          Add Student
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Student Name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Student Email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={createStudent}
              className="submit-btn"
            >
              Create Student
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Mentor List */}
      <Typography variant="h4" gutterBottom className="section-title">
        Mentor List
      </Typography>
      {mentors.map((mentor) => (
        <Paper key={mentor._id} elevation={2} className="detail-card">
          <Typography variant="h6" className="detail-name">
            {mentor.name}
          </Typography>
          <Typography variant="body1" className="detail-email">
            {mentor.email}
          </Typography>
        </Paper>
      ))}

      {/* Student List */}
      <Typography variant="h4" gutterBottom className="section-title">
        Student List
      </Typography>
      {students.map((student) => (
        <Paper key={student._id} elevation={2} className="detail-card">
          <Typography variant="h6" className="detail-name">
            {student.name}
          </Typography>
          <Typography variant="body1" className="detail-email">
            {student.email}
          </Typography>
        </Paper>
      ))}
    </Container>
  );
}

export default App;
