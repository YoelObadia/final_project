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
  amount: {
    marginRight: theme.spacing(4),
    marginLeft: theme.spacing(5),
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    border: `2px solid maroon`, // Bordure bordeaux
    boxShadow: `0 2px 4px rgba(0, 0, 0, 0.2)`, // Ombre autour du solde
    backgroundColor: `rgba(255, 255, 255, 0.8)`, // Fond en blanc transparent (plus clair)
    color: `maroon`, // Texte en bordeaux
    textDecoration:'underline',
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
    marginLeft: theme.spacing(0),
    color: theme.palette.common.white,
  },
  
  tableContainer: { 
    height: 'calc(100vh - 180px)', // Set height to calculate the remaining height after the app bar and other elements
    width: '1350px',
    marginLeft: '-400px',
    textAlignLast: 'center',
  },
 
  filterContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(2),
  },


  rectangleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '1350px',
    marginLeft: '-400px',
  },


  rectangle1: {
    width: '170px', // Adjust the width to match the width of each column
    height: '40px', // Adjust the height as needed
    backgroundColor: 'rgba(128, 0, 0, 0.2)', // Change the color to 'bordeaux' (transparent)
    textAlign: 'center',
    marginLeft: '0px',
  
  },
  rectangle2: {
    width: '150px', // Adjust the width to match the width of each column
    height: '40px', // Adjust the height as needed
    backgroundColor: 'rgba(128, 0, 0, 0.2)', // Change the color to 'bordeaux' (transparent)
    textAlign: 'center',
    marginLeft: '-110px',
  },

  rectangle3: {
    width: '250px', // Adjust the width to match the width of each column
    height: '40px', // Adjust the height as needed
    backgroundColor: 'rgba(128, 0, 0, 0.2)', // Change the color to 'bordeaux' (transparent)
    textAlign: 'center',
    marginLeft: '-110px',
  },
  rectangle4: {
    width: '530px', // Adjust the width to match the width of each column
    height: '40px', // Adjust the height as needed
    backgroundColor: 'rgba(128, 0, 0, 0.2)', // Change the color to 'bordeaux' (transparent)
    textAlign: 'center',
    marginLeft: '-110px',
  },
  rectangle5: {
    width: '250px', // Adjust the width to match the width of each column
    height: '40px', // Adjust the height as needed
    backgroundColor: 'rgba(128, 0, 0, 0.2)', // Change the color to 'bordeaux' (transparent)
    textAlign: 'center',
    marginLeft: '-110px',
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
              {current_user.firstname} {current_user.lastname}!
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
            
          </div>
          <Typography variant="h6" className={classes.amount}>
            Balance: {current_user.balance} $
          </Typography>
          <Button className={classes.logoutButton} color="inherit" onClick={Logout}>
              Logout
            </Button>
        </Toolbar>
      </AppBar>
      <div className={classes.filterContainer}>
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
      <div className={classes.rectangleContainer}>
        <div className={classes.rectangle1}>TYPE</div>
        <div className={classes.rectangle2}>AMOUNT</div>
        <div className={classes.rectangle3}>DATE</div>
        <div className={classes.rectangle4}>REASON</div>
        <div className={classes.rectangle5}>ACCOUNT NUMBER</div>
      </div>
      <TableContainer component={Paper}className={classes.tableContainer}>
        <Table>
          
          <TableBody component={Paper}className={classes.tablebody}>
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