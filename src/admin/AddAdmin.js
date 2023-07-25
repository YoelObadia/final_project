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
  const admin = JSON.parse(localStorage.getItem("currentAdmin"));
  const [current_admin] = useState(admin);
  const classes = useStyles();
  const [adminInfo, setAdminInfo] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    address: '', // Ajout du champ "address"
    username: '',
    password: '',
  });
  
  const validateForm = () => {
    const { firstname, lastname, email, phone, address, username, password } = adminInfo;
  
    // Vérifier si tous les champs sont remplis
    if (!firstname || !lastname || !email || !phone || !address || !username || !password) {
      alert('Veuillez remplir tous les champs.');
      return false;
    }
  
    // Valider le format du firstname et du prénom (lettres seulement)
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ']+$/;
    if (!nameRegex.test(firstname) || !nameRegex.test(lastname)) {
      alert('Le firstname et le prénom ne doivent contenir que des lettres.');
      return false;
    }
  
    // Valider le format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Veuillez entrer une adresse email valide.');
      return false;
    }
  
    // Valider le format du numéro de téléphone (commençant par 05)
    const phoneRegex = /^05[0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
      alert('Please enter a valid phone number starting with 05.');
      return false;
    }
  
    // Valider le format de l'adresse (numéro suivi de lettres, espaces et tirets)
    const addressRegex = /^[0-9]+\s[A-Za-z\s\-'À-ÖØ-öø-ÿ]+$/;
    if (!addressRegex.test(address)) {
      alert('Veuillez entrer une adresse valide (numéro suivi de lettres, espaces et tirets).');
      return false;
    }
  
    // Valider le format du username (numeric string de longueur 8 à 15)
    const usernameRegex = /^[0-9]{8,15}$/;
    if (!usernameRegex.test(username)) {
      alert('Le username doit être une chaîne numérique de longueur 8 à 15.');
      return false;
    }
  
    // Valider le format du mot de passe (numeric string de 6 chiffres)
    const passwordRegex = /^[0-9]{6}$/;
    if (!passwordRegex.test(password)) {
      alert('Le mot de passe doit être une chaîne numérique de 6 chiffres.');
      return false;
    }
  
    return true; // Tout est valide
  };
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAdminInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  
  const handleAddAdmin = async (event) => {
    event.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    const newAdmin = {
      firstname: adminInfo.firstname,
      lastname: adminInfo.lastname,
      email: adminInfo.email,
      phone: adminInfo.phone,
      address: adminInfo.address, // Ajout du champ "address"
      username: adminInfo.username,
    };
  
    try {
      const response = await fetch('/admin/addadmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAdmin),
      });
  
      if (!response.ok) {
        throw new Error('An error occurred while adding a new admin.');
      }
  
      const data = await response.json();
      console.log('Nouvel administrateur ajouté:', data);
  
      const newAdminPassword = {
        userId: data.insertId,
        username: adminInfo.username,
        password: adminInfo.password,
      };
  
      const response1 = await fetch('/admin/addadmin/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAdminPassword),
      });
  
      if (!response1.ok) {
        throw new Error('An error occurred while adding a new admin password.');
      }
  
      const data1 = await response1.json();
      console.log('Mot de passe administrateur ajouté:', data1);
  
      setAdminInfo({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        address: '', // Réinitialisation du champ "address"
        username: '',
        password: '',
      });
  
      alert('Nouvel administrateur ajouté avec succès !');
      navigate('/admin/home');
    } catch (error) {
      console.error('Erreur lors de la requête fetch:', error);
      alert('Une erreur est survenue lors de l\'ajout du nouvel administrateur.');
    }
  };
  
  

  const Logout = (event) => {
    event.preventDefault();
    navigate("/");
    localStorage.removeItem("currentAdmin");
  };

  return (
    <Grid container direction="column" spacing={2}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.welcome}>
          {current_admin.firstname} {current_admin.lastname}
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
              label="Firstname"
              name="firstname"
              value={adminInfo.firstname}
              onChange={handleInputChange}
              required
            />
            <TextField
              className={classes.formInput}
              label="Lastname"
              name="lastname"
              value={adminInfo.lastname}
              onChange={handleInputChange}
              required
            />
            <TextField
              className={classes.formInput}
              label="Email"
              name="email"
              type='email'
              value={adminInfo.email}
              onChange={handleInputChange}
              required
            />
            <TextField
              className={classes.formInput}
              label="Phone"
              name="phone"
              value={adminInfo.phone}
              onChange={handleInputChange}
              required
            />
            <TextField
              className={classes.formInput}
              label="Address"
              name="address"
              value={adminInfo.address}
              onChange={handleInputChange}
              required
            />
            <TextField
              className={classes.formInput}
              label="Username"
              name="username"
              value={adminInfo.username}
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

export default AddAdmin;