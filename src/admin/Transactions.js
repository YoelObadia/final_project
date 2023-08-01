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
  TableCell,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  Table,
  IconButton,
  TextField,
  MenuItem,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

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
  searchForm: {
    display: 'flex',
    marginLeft: '30%',
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
    width: '400px', // Initial width of the search form
  },
  searchFormActive: {
    width: '500px', // Width of the search form after clicking on it
  },
  searchInput: {
    marginRight: theme.spacing(2),
  },
  filterInput: {
    marginRight: theme.spacing(2),
    width: '200px',
    mqrginTop: theme.spacing(2),
  },
  clientListContainer: {
    background: 'rgba(178, 34, 34, 0.2)',
    padding: theme.spacing(2),
    height: 'calc(100vh - 160px)',
    overflowY: 'scroll',
    marginRight: theme.spacing(5),
    marginLeft: '-450px',
  },
  clientItem: {
    cursor: 'pointer',
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    alignContent: 'center',
  },
  clientDetailsContainer: {
    overflowY: 'scroll',
    height: 'calc(100vh - 200px)',
    width: '1080px',
    textAlignLast: 'center',
  },

  rectangle1: {
    width: '150px', // Adjust the width to match the width of each column
    height: '40px', // Adjust the height as needed
    backgroundColor: 'rgba(128, 0, 0, 0.2)', // Change the color to 'bordeaux' (transparent)
    textAlign: 'center',
    marginLeft: '0px',
  
  },
  rectangle2: {
    width: '100px', // Adjust the width to match the width of each column
    height: '40px', // Adjust the height as needed
    backgroundColor: 'rgba(128, 0, 0, 0.2)', // Change the color to 'bordeaux' (transparent)
    textAlign: 'center',
    marginLeft: '150px',
    marginTop: '-40px',
  },

  rectangle3: {
    width: '200px', // Adjust the width to match the width of each column
    height: '40px', // Adjust the height as needed
    backgroundColor: 'rgba(128, 0, 0, 0.2)', // Change the color to 'bordeaux' (transparent)
    textAlign: 'center',
    marginLeft: '250px',
    marginTop: '-40px',
  },
  rectangle4: {
    width: '464px', // Adjust the width to match the width of each column
    height: '40px', // Adjust the height as needed
    backgroundColor: 'rgba(128, 0, 0, 0.2)', // Change the color to 'bordeaux' (transparent)
    textAlign: 'center',
    marginLeft: '450px',
    marginTop: '-40px',
  },
  rectangle5: {
    width: '150px', // Adjust the width to match the width of each column
    height: '40px', // Adjust the height as needed
    backgroundColor: 'rgba(128, 0, 0, 0.2)', // Change the color to 'bordeaux' (transparent)
    textAlign: 'center',
    marginLeft: '914px',
    marginTop: '-40px',
  },
}));

function Transactions() {
  const classes = useStyles();
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("currentAdmin"));
  const [current_admin] = useState(admin);
  const [transactions, setTransactions] = useState([]);
  const [searchFormActive, setSearchFormActive] = useState(false);
  const [filterDate, setFilterDate] = useState(null);
  const [filterTransactionType, setFilterTransactionType] = useState(null);

  useEffect(() => {
    getClientsFromDatabase();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      handleClientItemClick(selectedClient); // Mise à jour des transactions avec le filtre actuel
    }
  }, [filterDate, filterTransactionType]);

  function Logout(event) {
    event.preventDefault();
    localStorage.removeItem("currentAdmin");
    navigate("/");
  }

  const getClientsFromDatabase = async () => {
    const fetchedClients = await getClients();
    setClients(fetchedClients);
    setFilteredClients(fetchedClients);
  };

  const getClients = async () => {
    try {
      const response = await fetch('/admin/transaction');
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

  const handleClientItemClick = async (client) => {
    setSelectedClient(client);

    try {
      let endpoint = `/admin/transactions/${client.id}`;
      const queryParams = [];

      if (filterTransactionType && filterTransactionType !== 'All') {
        queryParams.push(`filter=${filterTransactionType.toLowerCase()}`);
      }
      if (filterDate) {
        queryParams.push(`date=${filterDate}`);
      }

      if (queryParams.length > 0) {
        endpoint += `?${queryParams.join('&')}`;
      }

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Error fetching transactions from the server.');
      }
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions from the server:', error);
      setTransactions([]);
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
      <div >
        <div>



        </div>
        <div className={classes.rectangleContainer}>
        <div className={classes.rectangle1}>TYPE</div>
        <div className={classes.rectangle2}>AMOUNT</div>
        <div className={classes.rectangle3}>DATE</div>
        <div className={classes.rectangle4}>REASON</div>
        <div className={classes.rectangle5}>ACCOUNT NUMBER</div>
      </div>
        <TableContainer component={Paper}className={classes.clientDetailsContainer}>
          <Table>
            
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
              {current_admin.firstname} {current_admin.lastname}
            </Typography>
          )}
          <div className={classes.navLinkContainer}>
            <NavLink className={classes.navLink} to="/admin/customerInfo">
              CustomerInfo
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
        <TextField
  select
  label="Transaction Type"
  value={filterTransactionType}
  onChange={(e) => setFilterTransactionType(e.target.value)}
  variant="outlined"
  className={classes.filterInput}
>
  <MenuItem value="All">All</MenuItem>
  <MenuItem value="Deposit">Deposit</MenuItem>
  <MenuItem value="Withdraw">Withdraw</MenuItem>
  <MenuItem value="Received">Received Transfer</MenuItem>
  <MenuItem value="Shared">Shared Transfer</MenuItem>
</TextField>
      </form>
      <Grid item container alignItems="flex-start">
        <Grid item xs={12} sm={6} md={7} className={classes.clientListContainer}>
          {renderClientList()}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          {renderClientDetails()}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Transactions;
