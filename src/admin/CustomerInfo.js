import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Grid, Typography, AppBar, Toolbar, makeStyles, TextField, Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: 'maroon',
    width: '1550px',
    alignContent: 'center',
    alignItems: 'center',
    margin: 'auto',
    marginLeft: '-33%'
  },
  navLink: {
    '&.active': {
      backgroundColor: theme.palette.primary.light,
    },
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

function CustomerInfo() {
  const classes = useStyles();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar style={{ minHeight: '80px' }}>
            <NavLink exact to="/admin/customerInfo" className={classes.navLink} activeClassName="active">Customer Information</NavLink>
            <NavLink exact to="/admin/customer-account" className={classes.navLink} activeClassName="active">Customer Account</NavLink>
            <NavLink exact to="/admin/transfer" className={classes.navLink} activeClassName="active">Transfer</NavLink>
            <NavLink exact to="/admin/withdrawal" className={classes.navLink} activeClassName="active">Withdrawal</NavLink>
            <NavLink exact to="/admin/add-admin" className={classes.navLink} activeClassName="active">Add Admin</NavLink>
            <NavLink activeClassName="active">Logout</NavLink>
          </Toolbar>
        </AppBar>
      </Grid>
      <Grid item container alignItems="center">
        <Grid item xs={false} sm={2} />
        <Grid item xs={12} sm={8}>
          <Typography variant="h6" className={classes.customerInfo}>Customer Information</Typography>
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

export default CustomerInfo;
