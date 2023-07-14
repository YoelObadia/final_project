import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, TextField, Button } from '@material-ui/core';

function ClientLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = () => {
    // Effectuer des actions de connexion du client

    // Rediriger vers la page d'accueil du client
    navigate('/client/home');
  };

  const handleRegister = () => {
    // Rediriger vers la page d'enregistrement du client
    navigate('/client/register');
  };

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
      <Grid item xs={12}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleLogin} fullWidth>
          Login
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="secondary" onClick={handleRegister} fullWidth>
          Register
        </Button>
      </Grid>
    </Grid>
  );
}

export default ClientLogin;
