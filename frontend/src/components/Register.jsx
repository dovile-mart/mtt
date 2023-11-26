import React, { useState } from 'react';
import { Typography, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Update the path accordingly

function RegisterPage() {
  const [user, setUser] = useState({
    username: '',
    password: '',
    email: '', // Add the email field
  });
  const { login } = useAuth();
  const { username, password, email } = user;
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [errorMessages, setErrorMessages] = useState('');
  const [formattedError, setFormattedErrors] = useState('');
  const [fieldName, setFieldName] = useState('');

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const handleRegister = () => {
    // Make the registration API call
    axios.post('http://localhost:8080/api/auth/register', user, {
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => {
        // Assuming the registration was successful, log in the user
        login();
        console.log('User registered and authenticated');
        navigate('/'); // Redirect to the home page or another route
      })
      .catch((error) => {
        if (error.response) {
          console.error('Registration failed with status code', error.response.status);
          console.error('Error details:', error.response.data);

          // Check if error.response.data is an array
          const errorMessages = Array.isArray(error.response.data)
            ? error.response.data
            : [error.response.data];

          // Modify the error message format
          const formattedError = errorMessages
            .map(errorMessage => {
              // Use RegExp to remove "register.request." and trim the string
              return errorMessage.replace(/register\.request\./g, "").trim();
            })
            .join(', ');

          setError(formattedError);
        } else {
          console.error('Error occurred:', error.message);
        }
      });

  };

  return (
    <div>
      <Typography variant="h4">Register</Typography>

      <form>
        <div>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            name="username"
            value={username}
            onChange={handleChange}
          />
        </div>

        <div style={{ margin: '16px 0' }}>
          <TextField
            type="password"
            label="Password"
            variant="outlined"
            fullWidth
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>

        <div style={{ margin: '16px 0' }}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            name="email"
            value={email}
            onChange={handleChange}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Button variant="contained" color="primary" onClick={handleRegister}>
          Register
        </Button>
      </form>
    </div>
  );
}

export default RegisterPage;