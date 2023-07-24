import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Grid,
  Typography,
  AppBar,
  Toolbar,
  makeStyles,
  Button,
  Paper,
  TableCell,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  Table
} from '@material-ui/core';

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
    justifyContent: "space-between",
  },
  welcome: {
    marginRight: theme.spacing(4),
  },
  navLinkContainer: {
    display: "flex",
    alignItems: "center",
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
  // New styles for the client list and client details
  clientListContainer: {
    background: 'rgba(178, 34, 34, 0.2)', // Bordeaux transparent color
    padding: theme.spacing(2),
    height: 'calc(100vh - 160px)',
    overflowY: 'scroll',
    marginleft: theme.spacing(2),
  },
  clientItem: {
    cursor: 'pointer',
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    alignContent: 'center',
  },
  clientDetailsContainer: {
    marginLeft: theme.spacing(2),
    overflowY: 'scroll',
  },
}));

function Transactions() {
  const classes = useStyles();
  const [clients, setClients] = useState([]); // To store the list of clients
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null); // To store the selected client
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("currentAdmin"));
  const [current_admin] = useState(admin);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Fetch clients from the database and populate the 'clients' state
    getClientsFromDatabase();
  }, []);

  function Logout(event) {
    event.preventDefault();
    localStorage.removeItem("currentAdmin");
    navigate("/");
  }
  const getClientsFromDatabase = async () => {
    // You need to implement this function to fetch clients from the database
    // For simplicity, we'll assume it returns an array of clients
    const fetchedClients = await getClients();
    setClients(fetchedClients);
    setFilteredClients(fetchedClients); // Initially, the filtered list is the same as the complete list
  };
  const getClients = async () => {
    try {
      const response = await axios.get('/api/clients'); // En supposant que votre point d'accès API serveur est '/api/clients'
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des clients depuis le serveur :', error);
      return [];
    }
  };

  const handleSearchChange = (event) => {
    // Filter clients based on search input
    const searchQuery = event.target.value.toLowerCase();
    const filtered = clients.filter(
      (client) =>
        client.firstname.toLowerCase().includes(searchQuery) ||
        client.lastname.toLowerCase().includes(searchQuery)
    );
    setFilteredClients(filtered);
  };

  const handleClientItemClick = async (client) => {
    setSelectedClient(client);
  
    try {
      const response = await axios.get(`/admin/transactions/${client.id}`);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions from the server:', error);
      setTransactions([]); // Clear transactions in case of an error
    }
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
        <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Transaction Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Account Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.transactionType}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{transaction.timestamp}</TableCell>
                <TableCell>{transaction.reason}</TableCell>
                <TableCell>{transaction.receiverAccountNumber}</TableCell>
                {transaction.transactionType === 'Received Transfer' && (
                  <TableCell>{transaction.senderAccountNumber}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
        <Typography variant="h6" className={classes.welcome}>
          </Typography>
          {current_admin && (
            <Typography variant="h6" className={classes.welcome}>
              Welcome {current_admin.firstname} {current_admin.lastname}!
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
      <Grid item container alignItems="center">
        {/* Left side with client list */}
        <Grid item xs={12} sm={6} md={4} className={classes.clientListContainer}>
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

export default Transactions;
