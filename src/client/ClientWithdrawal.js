import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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

export function ClientWithdrawal() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [current_user, setCurrentUser] = useState(user);
  const navigate = useNavigate();
  const classes = useStyles();
  
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [pageMessage, setPageMessage] = useState('');

  useEffect(() => {
    fetchWithdrawalPage();
  }, []);

  function Logout(event) {
    event.preventDefault();
    navigate("/");
    localStorage.removeItem("currentUser");
  }

  const fetchWithdrawalPage = async () => {
    try {
      const response = await fetch('http://localhost:3000/client/withdrawal');
      const data = await response.json();

      setPageMessage(data.message);
    } catch (error) {
      console.error('Erreur lors de la récupération de la page de dépôt :', error);
    }
  };

  const handleWithdrawal = async (event) => {
    event.preventDefault();

    // Effectuer la logique pour envoyer la requête PUT au serveur pour le retrait d'argent
    const userId = current_user.id;
    const amount = parseFloat(withdrawalAmount);

    if (isNaN(amount) || amount <= 0) {
      // Vérification du montant invalide
      alert('Veuillez entrer un montant valide.');
      return;
    }

    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, amount }),
    };

    try {
      const response = await fetch('http://localhost:3000/client/withdrawal', requestOptions);
      const data = await response.json();

      // Afficher le message de succès et réinitialiser le champ du montant
      alert(data.message);
      setWithdrawalAmount('');

      // Mettre à jour le solde dans le state du composant
      setCurrentUser({ ...current_user, balance: data.newBalance });

      // Mettre à jour le solde dans le localStorage
      const updatedUser = { ...current_user, balance: data.newBalance };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Erreur lors de la demande de retrait :', error);
      alert('Une erreur est survenue lors du retrait.');
    }
  


    const requestOptionsinfo = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, amount }),
    };

    try {
      const response = await fetch('http://localhost:3000/client/withdrawal', requestOptionsinfo);
      const data = await response.json();

      // Afficher le message de succès et réinitialiser le champ du montant
    
      setWithdrawalAmount('');
    } catch (error) {
      console.error('Erreur lors de la demande de retrait :', error);
      alert('Une erreur est survenue lors du retrait.');
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
            <Typography variant="h4" align="center">Withdrawal</Typography>
            <Typography variant="body1" align="center">{pageMessage}</Typography>
            <form onSubmit={handleWithdrawal}>
              <TextField
                className={classes.formInput}
                label="Amount"
                type="number"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                required
                fullWidth
                variant="outlined"
              />
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <Button type="submit" variant="contained" className={classes.submitButton}>
               withdraw
              </Button>
              </div>
            </form>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default ClientWithdrawal;
