import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import {
  Grid,
  Typography,
  AppBar,
  Toolbar,
  makeStyles,
  Button,
  Paper,
  TextField,
  IconButton,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import PersonIcon from '@material-ui/icons/Person'; // Import the Person icon from Material-UI
import PhoneIcon from '@material-ui/icons/Phone';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import MailIcon from '@material-ui/icons/Mail';


const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: 'maroon',
    width: '1535px',
    alignContent: 'center',
    alignItems: 'center',
    margin: 'auto',
    marginLeft: '-500px',
  },
  navLink: {
    textDecoration: 'none',
    color: 'inherit',
    marginRight: theme.spacing(2),
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
  },
  toolbar: {
    justifyContent: 'space-between',
  },
  welcome: {
    marginRight: theme.spacing(4),
  },
  navLinkContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logoutButton: {
    marginLeft: theme.spacing(2),
    color: theme.palette.common.white,
  },
  searchContainer: {
    height: 'calc(100vh - 160px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  searchForm: {
    display: 'flex',
    marginLeft:'30%',
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
    // Animation
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    width: '200px', // Initial width of the search form
  },
  searchFormActive: {
    width: '300px', // Width of the search form after clicking on it
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
    marginLeft: 'auto',
  },
  // New styles for the client list and client details
  clientListContainer: {
    background: 'rgba(178, 34, 34, 0.2)', // Bordeaux transparent color
    padding: theme.spacing(2),
    height: 'calc(100vh - 160px)',
    overflowY: 'scroll',
    marginLeft: '-50%', // Change 'marginleft' to 'marginLeft'
  },
  clientItem: {
    cursor: 'pointer',
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    alignContent: 'center',
  },
  clientDetailsContainer: {
    marginLeft: '50%', // Change 'marginleft' to 'marginLeft
    width: '100%',
    marginTop: '10%',
  },
  clientDetailTitle: {
    fontWeight: 'bold',
    fontSize: '30px',
    alignItems: 'center',
    textAlign: 'center',
    textDecoration: 'underline',
    textDecorationColor: 'maroon',
    marginBottom: theme.spacing(4),
    marginLeft: '-40%',
  },
  clientDetailItem: {
    display: 'flex',
    alignItems: 'left',
    marginBottom: theme.spacing(1),
  },
  clientDetailIcon: {
    marginRight: theme.spacing(0),
    alignContent: 'center',
  },
}));

function CustomerInfo() {
  const classes = useStyles();
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem('currentAdmin'));
  const [current_admin] = useState(admin);
  const [searchFormActive, setSearchFormActive] = useState(false); // To handle the active state of the search form

  useEffect(() => {
    getClientsFromDatabase();
  }, []);

  function Logout(event) {
    event.preventDefault();
    localStorage.removeItem('currentAdmin');
    navigate('/');
  }

  const getClientsFromDatabase = async () => {
    // Implement this function to fetch clients from the database
    // For simplicity, we'll assume it returns an array of clients
    const fetchedClients = await getClients();
    setClients(fetchedClients);
    setFilteredClients(fetchedClients); // Initially, the filtered list is the same as the complete list
  };

  const getClients = async () => {
    try {
      const response = await fetch('/admin/customerInfo');
      if (!response.ok) {
        throw new Error('Error fetching clients from the server.');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching clients from the server:', error);
      return [];
    }
  };

  const handleSearchChange = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    const filtered = clients.filter(
      (client) =>
        client.firstname.toLowerCase().startsWith(searchQuery) ||
        client.lastname.toLowerCase().startsWith(searchQuery)
    );
    setFilteredClients(filtered);
  };

  const handleClientItemClick = (client) => {
    setSelectedClient(client);
  };

  const renderClientList = () => {
    return filteredClients.map((client) => (
      <Paper
        key={client.id}
        className={classes.clientItem}
        onClick={() => handleClientItemClick(client)}
      >
        {client.firstname} {client.lastname}
      </Paper>
    ));
  };

  const renderClientDetails = () => {
    if (!selectedClient) return null;

    return (
      <div className={classes.clientDetailsContainer}>
        <Typography variant="h6" className={classes.clientDetailTitle}>
          Client Information
        </Typography>
        <div className={classes.clientDetailItem}style={{ display: 'flex', alignItems: 'center' }}>
          <IconButton className={classes.clientDetailIcon}>
            <PersonIcon />
          </IconButton>
          <Typography style={{ fontWeight: 'bold' }}>{`  First Name:`}</Typography>
          <Typography>&nbsp;{`  ${selectedClient.firstname}`}</Typography>
        </div>
        <div className={classes.clientDetailItem}style={{ display: 'flex', alignItems: 'center' }}>
          <IconButton className={classes.clientDetailIcon}>
            <PersonIcon />
          </IconButton>
          <Typography style={{ fontWeight: 'bold' }}>{`Last Name :`}</Typography>
          <Typography>&nbsp;{`  ${selectedClient.lastname}`}</Typography>
        </div>
        <div className={classes.clientDetailItem}style={{ display: 'flex', alignItems: 'center' }}>
          <IconButton className={classes.clientDetailIcon}>
            <PhoneIcon />
          </IconButton>
          <Typography style={{ fontWeight: 'bold' }}>{`Phone: `}</Typography>
          <Typography>&nbsp;{`  ${selectedClient.phone}`}</Typography>
        </div>
        <div className={classes.clientDetailItem}style={{ display: 'flex', alignItems: 'center' }}>
          <IconButton className={classes.clientDetailIcon}>
            <MailIcon />
          </IconButton>
          <Typography style={{ fontWeight: 'bold' }}>{`Email: `}</Typography>
          <Typography>&nbsp;{`  ${selectedClient.email}`}</Typography>
        </div>
        <div className={classes.clientDetailItem}style={{ display: 'flex', alignItems: 'center' }}>
          <IconButton className={classes.clientDetailIcon}>
            <LocationOnIcon />
          </IconButton>
          <Typography style={{ fontWeight: 'bold' }}>{`Address: `}</Typography>
          <Typography>&nbsp;{`  ${selectedClient.address}`}</Typography>
        </div>
        <div className={classes.clientDetailItem}style={{ display: 'flex', alignItems: 'center' }}>
          <IconButton className={classes.clientDetailIcon}>
            <PersonIcon />
          </IconButton>
          <Typography style={{ fontWeight: 'bold' }}>{`Username:`}</Typography>
          <Typography>&nbsp;{`  ${selectedClient.username}`}</Typography>
        </div>
      </div>
    );
  };

  const navigateToHome = () => {
    // You may want to implement this function to handle the navigation back to the home page
    // navigate("/");
  };

  return (
    <Grid container direction="column" spacing={2}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" className={classes.welcome}></Typography>
          {current_admin && (
            <Typography variant="h6" className={classes.welcome}>
              {current_admin.firstname} {current_admin.lastname}
            </Typography>
          )}
          <div className={classes.navLinkContainer}>
            <NavLink className={classes.navLink} to="/admin/customerInfo">
              CustomerInfo
            </NavLink>
            <NavLink className={classes.navLink} to="/admin/transfer">
              Transfer
            </NavLink>
            <NavLink className={classes.navLink} to="/admin/transactions">
              Transactions
            </NavLink>
            <NavLink className={classes.navLink} to="/admin/addAdmin">
              Add Administrator
            </NavLink>
            <Button className={classes.logoutButton} color="inherit" onClick={Logout}>
              Logout
            </Button>
          </div>
        </Toolbar>
      </AppBar>

      {/* Animated Search form */}
      <form
        className={`${classes.searchForm} ${
          searchFormActive ? classes.searchFormActive : ''
        }`}
      >
        <TextField
          type="text"
          placeholder="Search by name..."
          className={classes.searchInput}
          onFocus={() => setSearchFormActive(true)}
          onBlur={() => setSearchFormActive(false)}
          onChange={handleSearchChange}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleSearchChange}>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
      </form>

      <Grid item container alignItems="flex-start">
        {/* Left side with client list */}
        <Grid item xs={12} sm={6} md={7} className={classes.clientListContainer}>
          {renderClientList()}
        </Grid>

        {/* Right side with client details */}
        <Grid item xs={12} sm={6} md={8}>
          {renderClientDetails()}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default CustomerInfo;
