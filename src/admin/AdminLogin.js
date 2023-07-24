import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, TextField, Button } from '@material-ui/core';

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
   
      if (response.ok) {
        const data = await response.json();
        // Stocker les informations du client dans le localStorage
        localStorage.setItem('currentAdmin', JSON.stringify(data));
        // Rediriger vers la page d'accueil du client
        navigate('/admin/home');
      } else {
        const errorData = await response.json();
        console.error('Erreur de connexion de l\'admin :', errorData.message);
        // Afficher une erreur à l'utilisateur
      }
    } catch (error) {
      console.error('Erreur lors de la connexion de l\'admin :', error);
      // Afficher une erreur à l'utilisateur
    }
  
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
    </Grid>
  );
}

export default AdminLogin;
