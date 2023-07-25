import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Grid, Typography, AppBar, Toolbar, makeStyles, TextField, Button, Paper } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: 'maroon',
    width: '1535px',
    alignContent: 'center',
    alignItems: 'center',
    margin: 'auto',
    marginLeft: '-500px'
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
  // New styles for the container and list items
  transferContainer: {
    background: 'rgba(178, 34, 34, 0.2)', // Bordeaux transparent color
    padding: theme.spacing(2),
    height: 'calc(100vh - 160px)',
    overflowY: 'scroll',
    margin: 'auto',
  },
  transferItem: {
    cursor: 'pointer',
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    alignContent: 'center',
  },
}));

function Transfer() {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("currentAdmin"));
  const [current_admin] = useState(admin);
  const classes = useStyles();
  const [isFocused, setIsFocused] = useState(false);
  const [transfers, setTransfers] = useState([]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const Logout = (event) => {
    event.preventDefault();
    navigate("/");
    localStorage.removeItem("currentAdmin");
  };

  const getTransfersFromDatabase = async () => {
    // Implement this function to fetch transfers from the database
    // For simplicity, we'll assume it returns an array of transfers
    const fetchedTransfers = await getTransfers();
    setTransfers(fetchedTransfers);
  };

  const getTransfers = async () => {
    try {
      // Fetch transfers from the server, replace '/admin/transfers' with the actual endpoint
      const response = await fetch('/admin/transfers');
      if (!response.ok) {
        throw new Error('Error fetching transfers from the server.');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching transfers from the server:', error);
      return [];
    }
  };

  useEffect(() => {
    getTransfersFromDatabase();
  }, []);

  const renderTransferList = () => {
    // Filter transfers with amount greater than 5000
    const filteredTransfers = transfers.filter((transfer) => transfer.amount > 5000);

    return filteredTransfers.map((transfer) => (
      <Paper key={transfer.id} className={classes.transferItem}>
        {/* Display transfer information here */}
        {/* Example: */}
        <Typography>{`Transfer ID: ${transfer.id}`}</Typography>
        <Typography>{`Amount: ${transfer.amount}`}</Typography>
        <Typography>{`Date: ${transfer.date}`}</Typography>
        {/* Add other transfer information */}
      </Paper>
    ));
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
      {/* New container for transfer list */}
      <Grid item container justifyContent="center" className={classes.transferContainer}>
        {renderTransferList()}
      </Grid>
    </Grid>
  );
}

export default Transfer;
