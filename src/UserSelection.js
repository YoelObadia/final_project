import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, Typography, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundColor: '#f0f0f0',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    padding: theme.spacing(3),
    borderRadius: theme.spacing(1),
    backgroundColor: '#6d071a51',
  },
  button: {
    margin: theme.spacing(2, 0),
    backgroundColor: 'maroon',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: 'darkred',
    },
  },
  errorContainer: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(2),
    backgroundColor: '#f44336',
    color: '#ffffff',
    borderRadius: theme.spacing(1),
    textAlign: 'center',
  },
}));

function UserSelection() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleAdminLogin = async () => {
    try {
      const response = await fetch('/admin/login');
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
        return;
      }
      navigate('/admin/login');
    } catch (error) {
      setErrorMessage('Error 404. Page not found!');
      setTimeout(() => {
        setErrorMessage('');
      }, 1500);
    }
  };

  const handleClientLogin = async () => {
    try {
      const response = await fetch('/client/login');
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
        return;
      }
      navigate('/client/login');
    } catch (error) {
      setErrorMessage('Error 404. Page not found!');
      setTimeout(() => {
        setErrorMessage('');
      }, 1500);
    }
  };

  return (
    <div className={classes.background}>
      <Container maxWidth="sm">
        <Grid container spacing={2} className={classes.contentContainer}>
          {errorMessage && (
            <Grid item xs={12}>
              <div className={classes.errorContainer}>{errorMessage}</div>
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography variant="h4" align="center">
              Welcome to <br /> Royal Bank
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              className={classes.button}
              onClick={handleAdminLogin}
            >
              Admin
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              className={classes.button}
              onClick={handleClientLogin}
            >
              Client
            </Button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default UserSelection;
