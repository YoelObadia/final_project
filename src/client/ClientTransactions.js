import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: 'maroon',
    width: '1535px',
    alignContent:'center',
    alignItems:'center',
    margin:'auto',
    marginLeft:'-500px'
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
  navLink: {
    margin: theme.spacing(0, 2),
    textDecoration: "none",
    color: theme.palette.common.white,
  },
  logoutButton: {
    marginLeft: theme.spacing(2),
    color: theme.palette.common.white,
  },
  square: {
    backgroundColor: "maroon",
    color: theme.palette.common.white,
    height: 300,
    width: 740,
    marginTop:'10px',
    marginLeft:'-470px',
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  square1: {
    backgroundColor: "maroon",
    color: theme.palette.common.white,
    height: 300,
    width: 740,
    marginTop:'10px',
    marginLeft:'10px',
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  square2: {
    backgroundColor: "maroon",
    color: theme.palette.common.white,
    height: 300,
    width: 740,
    marginTop:'50px',
    marginLeft:'-470px',
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  square3: {
    backgroundColor: "maroon",
    color: theme.palette.common.white,
    height: 300,
    width: 740,
    marginBottom:'50px',
    marginLeft:'10px',
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
 
  largeSquare: {
    flexBasis: '500px',
    marginRight: theme.spacing(2),
  },

  filterContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  filterLabel: {
    marginBottom: theme.spacing(1),
  },
}));


export function Transactions({ userId }) {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [current_user] = useState(user);
  const navigate = useNavigate();
  const classes = useStyles();
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  userId = current_user.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/client/transactions/${userId}?filter=${filter}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          setTransactions([]);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactions([]);
      }
    };

    fetchData();
  }, [userId, filter]);

  function Logout(event) {
    event.preventDefault();
    navigate("/");
    localStorage.removeItem("currentUser");
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          {current_user && (
            <Typography variant="h6" className={classes.welcome}>
              Welcome {current_user.firstname} {current_user.lastname}!
            </Typography>
          )}
          <div className={classes.navLinkContainer}>
            <NavLink className={classes.navLink} to="/client/deposit">
              Deposit
            </NavLink>
            <NavLink className={classes.navLink} to="/client/withdrawal">
              Withdrawal
            </NavLink>
            <NavLink className={classes.navLink} to="/client/transfer">
              Transfer
            </NavLink>
            <NavLink className={classes.navLink} to="/client/transactions">
              Transactions
            </NavLink>
            <Button className={classes.logoutButton} color="inherit" onClick={Logout}>
              Logout
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.filterContainer}>
        <InputLabel className={classes.filterLabel}>Filter</InputLabel>
        <FormControl>
          <Select value={filter} onChange={handleFilterChange}>
            <MenuItem value="all">All Transactions</MenuItem>
            <MenuItem value="deposit">Deposits</MenuItem>
            <MenuItem value="withdraw">Withdraws</MenuItem>
            <MenuItem value="received">Received Transfers</MenuItem>
            <MenuItem value="shared">Shared Transfers</MenuItem>
          </Select>
        </FormControl>
      </div>
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
}

export default Transactions;