import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AppBar, Toolbar, Typography, Button, makeStyles, Grid, TextField } from "@material-ui/core";

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
  formContainer: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'rgba(128, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
    width: '400px',
    height: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formInput: {
    margin: theme.spacing(1),
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "maroon",
      },
      "&:hover fieldset": {
        borderColor: "maroon",
      },
      "&.Mui-focused fieldset": {
        borderColor: "maroon",
      },
    },
    "& label.Mui-focused": {
      color: "maroon",
    },
  },
  submitButton: {
    backgroundColor: 'maroon',
    color: 'white',
    "&:hover": {
      backgroundColor: 'maroon',
    },
  },
}));

export function ClientDeposit() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [current_user] = useState(user);
  const navigate = useNavigate();
  const classes = useStyles();
  
  const [depositAmount, setDepositAmount] = useState('');

  function Logout(event) {
    event.preventDefault();
    navigate("/");
    localStorage.removeItem("currentUser");
  }

  const handleDeposit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/client/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id, amount: depositAmount }),
      });

      if (response.ok) {
        // Afficher un message de réussite ou naviguer vers la page de confirmation
      } else {
        const errorData = await response.json();
        console.error('Erreur lors du dépôt du client :', errorData.message);
        // Afficher une erreur à l'utilisateur
      }
    } catch (error) {
      console.error('Erreur lors du dépôt du client :', error);
      // Afficher une erreur à l'utilisateur
    }
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
        <Grid item xs={12} sm={6}>
          <div className={classes.formContainer}>
            <Typography variant="h4" align="center">Deposit</Typography>
            <form onSubmit={handleDeposit}>
              <TextField
                className={classes.formInput}
                label="Amount"
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                required
                fullWidth
                variant="outlined"
              />
              <Button type="submit" variant="contained" className={classes.submitButton}>
                Submit
              </Button>
            </form>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default ClientDeposit;
