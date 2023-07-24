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
  const [ , setGivenUserId] = useState(0);
  const [isRegister, setIsRegister] = useState(false);
  const [ , setCurrentUser] = useState(null);

  const handleGoBack = () => {
    navigate('/client/login');
  };

  const validateForm = () => {
    if (
      !firstName ||
      !lastName ||
      !phone ||
      !email ||
      !address ||
      !username ||
      !password
    ) {
      alert('Please fill in all the required fields.');
      return false;
    }
  
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ']+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      alert('First name and last name should contain only letters.');
      return false;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return false;
    }
  
    const phoneRegex = /^05[0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
      alert('Please enter a valid phone number starting with 05.');
      return false;
    }
  
    const addressRegex = /^[0-9]+\s[A-Za-z\s\-'À-ÖØ-öø-ÿ]+$/;
    if (!addressRegex.test(address)) {
      alert('Please enter a valid address.');
      return false;
    }
  
    const usernameRegex = /^[0-9]{8}$/;
    if (!usernameRegex.test(username)) {
      alert('Username should be a numeric string of length 8 to 15.');
      return false;
    }
  
    const passwordRegex = /^[0-9]{6}$/;
    if (!passwordRegex.test(password)) {
      alert('Password should be a 6-digit numeric string.');
      return false;
    }
  
    return true;
  };
  

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newUser = {
      firstname: firstName,
      lastname: lastName,
      phone: phone,
      email: email,
      address: address,
      username: username,
    };

    try {
      const response = await fetch('/client/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error('An error occurred while adding a new user.');
      }

      const data = await response.json();
      const newUserId = data[0].id;
      setCurrentUser(data[0]);
      console.log(newUserId);
      setGivenUserId(newUserId);

      const new_user_pass = {
        userId: newUserId,
        username: username,
        password: password,
      };

      const response1 = await fetch('/client/register/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(new_user_pass),
      });

      if (!response1.ok) {
        throw new Error('An error occurred while adding a new user_password.');
      }

      const data1 = await response1.json();
      localStorage.setItem('currentUser', JSON.stringify(data[0]));
      console.log(data1);

      const newAccount = {
        userId: newUserId,
        username: username,
      };

      const response2 = await fetch('/client/register/account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAccount),
      });

      if (!response2.ok) {
        throw new Error('An error occurred while adding a new account.');
      }

      const data2 = await response2.json();
      console.log(data2);

      setIsRegister(true);
      console.log('registration succeeded');

      // passer aux pages de connexion
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  if (isRegister) {
    navigate(`/client/home`);
  } else {
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
}

export default ClientRegister;