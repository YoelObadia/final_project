import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import { AppBar, Toolbar, Typography, Button, makeStyles, Grid } from "@material-ui/core";

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
    marginBottom: theme.spacing(2),
  },
 
  largeSquare: {
    flexBasis: '500px',
    marginRight: theme.spacing(2),
  },
}));

export const EssaiContext = createContext();

export function Transactions() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [current_user] = useState(user);
  const navigate = useNavigate();
  const classes = useStyles();
  const [depositInfo, setDepositInfo] = useState([]);
  const [withdrawalInfo, setWithdrawalInfo] = useState([]);
  const [sharedSendInfo, setSharedSendInfo] = useState([]);
  const [sharedReceivedInfo, setSharedReceivedInfo] = useState([]);

  useEffect(() => {
    fetch("/api/deposit")
      .then((response) => response.json())
      .then((data) => {
        setDepositInfo(data);
      })
      .catch((error) => {
        console.log(error);
      });

    fetch("/api/withdrawal")
      .then((response) => response.json())
      .then((data) => {
        setWithdrawalInfo(data);
      })
      .catch((error) => {
        console.log(error);
      });

    fetch("/api/shared-send")
      .then((response) => response.json())
      .then((data) => {
        setSharedSendInfo(data);
      })
      .catch((error) => {
        console.log(error);
      });

    fetch("/api/shared-received")
      .then((response) => response.json())
      .then((data) => {
        setSharedReceivedInfo(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function Logout(event) {
    event.preventDefault();
    navigate("/");
    localStorage.removeItem("currentUser");
  }

  return (
    <div>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          {current_user && (
            <Typography variant="h6" className={classes.welcome}>
              Welcome {current_user.name}!
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
      <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
        <Grid item xs={12} sm={6} md={6}>
          <div className={`${classes.square} ${classes.largeSquare}`}>
            <Typography variant="h6">Deposit</Typography>
            <ul>
              {depositInfo.map((deposit) => (
                <li key={deposit.id}>
                  Amount: {deposit.amount}, Date: {deposit.timestamp}
                </li>
              ))}
            </ul>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <div className={`${classes.square1} ${classes.largeSquare}`}>
            <Typography variant="h6">Withdrawal</Typography>
            <ul>
              {withdrawalInfo.map((withdrawal) => (
                <li key={withdrawal.id}>
                  Amount: {withdrawal.amount}, Timestamp: {withdrawal.timestamp}
                </li>
              ))}
            </ul>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <div className={classes.square2}>
            <Typography variant="h6">Shared Send</Typography>
            <ul>
              {sharedSendInfo.map((sharedSend) => (
                <li key={sharedSend.id}>
                  Amount: {sharedSend.amount}, Reason: {sharedSend.reason}
                </li>
              ))}
            </ul>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <div className={classes.square3}>
            <Typography variant="h6">Shared Received</Typography>
            <ul>
              {sharedReceivedInfo.map((sharedReceived) => (
                <li key={sharedReceived.id}>
                  Amount: {sharedReceived.amount}, Reason: {sharedReceived.reason}
                </li>
              ))}
            </ul>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default Transactions;
