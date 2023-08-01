import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, makeStyles, Grid, TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: 'maroon',
    width: '1535px',
    alignContent: 'center',
    alignItems: 'center',
    margin: 'auto',
    marginLeft: '-500px'
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
  const [current_user, setCurrentUser] = useState(user);
  const navigate = useNavigate();
  const classes = useStyles();

  const [depositAmount, setDepositAmount] = useState('');
  const [pageMessage, setPageMessage] = useState('');

  useEffect(() => {
    fetchDepositPage();
  }, []);

  function Logout(event) {
    event.preventDefault();
    navigate("/");
    localStorage.removeItem("currentUser");
  }

  const fetchDepositPage = async () => {
    try {
      const response = await fetch('http://localhost:3000/client/deposit');
      const data = await response.json();

      setPageMessage(data.message);
    } catch (error) {
      console.error('Erreur lors de la récupération de la page de dépôt :', error);
    }
  };

  const handleDeposit = async (event) => {
    event.preventDefault();

    const userId = current_user.id;
    const amount = parseFloat(depositAmount);

    if (isNaN(amount) || amount <= 0) {
      alert('Veuillez entrer un montant valide.');
      return;
    }

    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, amount }),
    };

    try {
      const response = await fetch('http://localhost:3000/client/deposit', requestOptions);
      const data = await response.json();

      alert(data.message);
      setDepositAmount('');

      // Mettre à jour automatiquement le solde dans la navbar
      if (data.newBalance) {
        setCurrentUser((prevUser) => ({ ...prevUser, balance: data.newBalance }));
      }

      // Appel à la fonction pour enregistrer le dépôt dans la table "deposits"
    } catch (error) {
      console.error('Erreur lors de la demande de dépôt :', error);
      alert('Une erreur est survenue lors du dépôt.');
    }


    /////
    const requestOptionsinfo = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, amount }),
    };
  
    try {
      const response = await fetch('http://localhost:3000/client/deposit', requestOptionsinfo);
      const data = await response.json();
  
      // Afficher le message de succès et réinitialiser le champ du montant
      
      setDepositAmount('');
    } catch (error) {
      console.error('Erreur lors de la demande de depot :', error);
      alert('Une erreur est survenue lors du depot.');
    }
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
      <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
        <Grid item xs={12} sm={6}>
          <div className={classes.formContainer}>
            <Typography variant="h4" align="center">Deposit</Typography>
            <Typography variant="body1" align="center">{pageMessage}</Typography>
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
               <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <Button type="submit" variant="contained" className={classes.submitButton}>
                Deposit
              </Button>
              </div>
            </form>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default ClientDeposit;
