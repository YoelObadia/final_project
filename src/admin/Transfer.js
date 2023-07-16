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
  searchContainer: {
    height: 'calc(100vh - 160px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  searchForm: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderWidth: '2px',
      },
      '&:hover fieldset': {
        borderColor: theme.palette.secondary.main,
      },
    },
  },
  searchInput: {
    marginRight: theme.spacing(2),
  },
  customerInfo: {
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: '24px',
    marginLeft: theme.spacing(2),
  },
  searchButton: {
    backgroundColor: 'maroon',
    color: 'white',
  },
}));

function Transfer() {
  const navigate = useNavigate();

  const classes = useStyles();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
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
      <Grid item container alignItems="center">
        <Grid item xs={false} sm={2} />
        <Grid item xs={12} sm={8}>
          <Typography variant="h6" className={classes.customerInfo}>
            Transfer Money
          </Typography>
        </Grid>
      </Grid>
      <Grid item container justifyContent="center" className={classes.searchContainer}>
        <Grid item>
          <form className={classes.searchForm} onFocus={handleFocus} onBlur={handleBlur}>
            <TextField
              variant="outlined"
              label="Search"
              className={classes.searchInput}
              InputProps={{
                classes: {
                  notchedOutline: isFocused ? classes.searchInputFocused : null,
                },
              }}
            />
            <Button variant="contained" className={classes.searchButton}>
              Search
            </Button>
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Transfer;
