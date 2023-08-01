import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, TextField, Button, Typography } from '@material-ui/core';

function ClientLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(null);

  const handleLogin = async () => {
    setError(null); // Réinitialiser l'erreur à chaque tentative de connexion

    try {
      const response = await fetch('http://localhost:3000/client/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
   
      if (response.ok) {
        const data = await response.json();
        // Stocker les informations du client dans le localStorage
        localStorage.setItem('currentUser', JSON.stringify(data));
        // Rediriger vers la page d'accueil du client
        navigate('/client/home');
      } else {
        const errorData = await response.json();
        setError(errorData.message); // Définir le message d'erreur reçu depuis le serveur
      }
    } catch (error) {
      console.error('Erreur lors de la connexion du client :', error);
      setError('Une erreur s\'est produite lors de la connexion.'); // Message d'erreur générique en cas d'erreur côté client
    }
  };

  const handleRegister = () => {
    // Rediriger vers la page d'enregistrement du client
    navigate('/client/register');
  };

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
      {error && (
        <Grid item xs={12}>
          <Typography variant="body1" color="error" align="center">
            {error}
          </Typography>
        </Grid>
      )}
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
