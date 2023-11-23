import { Typography, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';

function LoginPage() {
  const [user, setUser] = useState({
    username: '',
    password: '',
  });
  const { login } = useAuth();
  const { username, password } = user;
  const navigate = useNavigate();

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const handleLogin = () => {
    axios
      .post('http://localhost:8080/api/auth/login', user, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        const jwtToken = res.headers.authorization;
        if (jwtToken !== null) {
          sessionStorage.setItem('jwt', jwtToken);
          login();
          console.log('isAuthenticated');
          navigate('/');
        }
      });
  };

  return (
    <div>
      <Typography variant="h4">Login</Typography>

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

        <Button variant="contained" color="primary" onClick={handleLogin}>
          Login
        </Button>
      </form>
    </div>
  );
}

export default LoginPage;
