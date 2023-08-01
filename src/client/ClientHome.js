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
}));

export const EssaiContext = createContext();

export function ClientHome() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [current_user, setCurrentUser] = useState(user); // Change "current_user" to "setCurrentUser" in the line below
  const [, setError] = useState(null); // État pour stocker les erreurs
  
  const navigate = useNavigate();
  const classes = useStyles();

  function Logout(event) {
    event.preventDefault();
    localStorage.removeItem("currentUser");
    navigate("/");
  }

 // ...
 useEffect(() => {
   setCurrentUser(user);
   const fetchBalance = async () => {
     try {
       if (user && user.clientId) {
         const response = await fetch('http://localhost:3000/client/home', {
           method: 'GET',
           headers: {
             'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user.clientId }),
          });
          
          if (response.ok) {
            const data = await response.json();
            // Stocker les informations du client dans le localStorage
            localStorage.setItem('currentAccountUser', JSON.stringify(data));
            // Rediriger vers la page d'accueil du client
            
          } else {
            const errorData = await response.json();
            setError(errorData.message); // Définir le message d'erreur reçu depuis le serveur
          }
        }} catch (error) {
      console.error('Erreur lors de la connexion du client :', error);
      setError('Une erreur s\'est produite lors de la connexion.'); // Message d'erreur générique en cas d'erreur côté client
    }
  };
  
  fetchBalance();
}, [user]);
// ...


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
        <Grid item>
          {/* Modify this to client of url */}

          <Typography variant="h4">Welcome!</Typography>
        </Grid>
      </Grid>
    </div>
  );
}

export default ClientHome;
