import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, Typography, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    background: {
      backgroundColor: '#f0f0f0', // Couleur de fond souhaitée
      minHeight: '100vh', // Hauteur minimale de la page pour remplir l'écran
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    contentContainer: {
      padding: theme.spacing(3),
      borderRadius: theme.spacing(1),
      backgroundColor: '#6d071a51', // Couleur de fond pour le contenu
    },
    button: {
      margin: theme.spacing(2, 0),
      backgroundColor: 'maroon', // Couleur de fond pour les boutons (bordeaux)
      color: '#ffffff', // Couleur du texte pour les boutons (blanc)
      '&:hover': {
        backgroundColor: 'darkred', // Couleur de fond au survol des boutons (bordeaux foncé)
      },
    },
  }));

function UserSelection() {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    navigate('/admin/login');
  };

  const handleClientLogin = () => {
    navigate('/client/login');
  };

  return (
    <div className={classes.background}>
      <Container maxWidth="sm">
        <Grid container spacing={2} className={classes.contentContainer}>
          <Grid item xs={12}>
            <Typography variant="h4" align="center">
              Welcome to <br></br> Royal Bank
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
