import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Grid, Typography, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(4),
    background: 'linear-gradient(to right, #fbc2eb, #a6c1ee)',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
  },
  formField: {
    margin: theme.spacing(1, 0),
  },
  formButtons: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(2),
  },
}));

function ClientRegister() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleRegister = () => {
    // Effectuer des actions d'enregistrement du client
    // Vérifier l'utilisation d'Axios et de JWT si nécessaire

    // Rediriger vers la page de connexion du client
    navigate('/client/home');
  };

  const handleGoBack = () => {
    navigate('/client/login');
  };

  return (
    <Container maxWidth="sm">
      <Grid container spacing={2} className={classes.formContainer}>
        <Grid item xs={12}>
          <Typography variant="h5" align="center">
            Register
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            fullWidth
            className={classes.formField}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            fullWidth
            className={classes.formField}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            className={classes.formField}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            fullWidth
            className={classes.formField}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            fullWidth
            className={classes.formField}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            fullWidth
            className={classes.formField}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            className={classes.formField}
          />
        </Grid>
        <Grid item xs={12} className={classes.formButtons}>
          <Button variant="contained" color="primary" onClick={handleRegister}>
            Register
          </Button>
          <Button variant="contained" color="secondary" onClick={handleGoBack}>
            Back to Login
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ClientRegister;
