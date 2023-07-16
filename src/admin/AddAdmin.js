import React, { useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { Grid, Typography, AppBar, Toolbar, makeStyles, TextField, Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: 'maroon',
    width: '1535px',
    alignContent:'center',
    alignItems:'center',
    margin:'auto',
    marginLeft:'-500px'
  },
  navLink: {
    textDecoration: 'none',
    color: 'inherit',
    marginRight: theme.spacing(2),
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
  },
  formContainer: {
    height: 'calc(100vh - 160px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'rgba(128, 0, 0, 0.6)',
    marginTop: theme.spacing(4),
  },
  formInput: {
    margin: theme.spacing(1),
  },
  addButton: {
    backgroundColor: 'maroon',
    color: 'white',
  },
}));

function AddAdmin() {
  const navigate = useNavigate();

  const classes = useStyles();
  const [adminInfo, setAdminInfo] = useState({
    nom: '',
    prenom: '',
    mail: '',
    telephone: '',
    password: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAdminInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddAdmin = (event) => {
    event.preventDefault();
    // Logic to add new admin using adminInfo state
  };

  const Logout = (event) => {
    event.preventDefault();
    navigate("/");
    localStorage.removeItem("currentUser");
  };

  return (
    <Grid container direction="column" spacing={2}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.welcome}>
            Welcome [Username]!
          </Typography>
          <div className={classes.navLinkContainer}>
            <NavLink className={classes.navLink} to="/admin/CustomerInfo">
              Customer Info
            </NavLink>
            <NavLink className={classes.navLink} to="/admin/transfer">
              Transfer
            </NavLink>
            <NavLink className={classes.navLink} to="/admin/Transactions">
              Transactions
            </NavLink>
            <NavLink className={classes.navLink} to="/admin/AddAdmin">
              Add Administrator
            </NavLink>
            <Button className={classes.logoutButton} color="inherit" onClick={Logout}>
              Logout
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      <Grid item container justifyContent="center" className={classes.formContainer}>
        <Grid item xs={12} sm={6}>
          <form className={classes.form} onSubmit={handleAddAdmin}>
            <TextField
              className={classes.formInput}
              label="Nom"
              name="nom"
              value={adminInfo.nom}
              onChange={handleInputChange}
              required
            />
            <TextField
              className={classes.formInput}
              label="Prénom"
              name="prenom"
              value={adminInfo.prenom}
              onChange={handleInputChange}
              required
            />
            <TextField
              className={classes.formInput}
              label="Mail"
              name="mail"
              value={adminInfo.mail}
              onChange={handleInputChange}
              required
            />
            <TextField
              className={classes.formInput}
              label="Téléphone"
              name="telephone"
              value={adminInfo.telephone}
              onChange={handleInputChange}
              required
            />
            <TextField
              className={classes.formInput}
              label="Password"
              type="password"
              name="password"
              value={adminInfo.password}
              onChange={handleInputChange}
              required
            />
            <Button type="submit" variant="contained" className={classes.addButton}>
              Add Administrator
            </Button>
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default AddAdmin;
