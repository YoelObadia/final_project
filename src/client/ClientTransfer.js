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
    height: '300px',
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


export function ClientTransfer() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [current_user] = useState(user);
  const navigate = useNavigate();
  const classes = useStyles();
  
  const [transferAmount, setTransferAmount] = useState('');
  const [paymentReason, setPaymentReason] = useState('');
  const [recipientAccountNumber, setRecipientAccountNumber] = useState('');
  const [senderAccountNumber, setsenderAccountNumber] = useState('');
  const [transferMessage, setTransferMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchTransferPage();
  }, []);

  function Logout(event) {
    event.preventDefault();
    navigate("/");
    localStorage.removeItem("currentUser");
  }

  const fetchTransferPage = async () => {
    try {
      const response = await fetch('http://localhost:3000/client/transfer');
      const data = await response.json();

      setTransferMessage(data.message);
    } catch (error) {
      console.error('Erreur lors de la récupération de la page de dépôt :', error);
    }
  };

  const handleTransfer = async (event) => {
    event.preventDefault();

    // Vérification des champs obligatoires
    if (!transferAmount || !paymentReason || !recipientAccountNumber) {
      setErrorMessage('Veuillez remplir tous les champs.');
      return;
    }

    // Appel de l'API pour effectuer le transfert
    try {
      const response = await fetch('/client/transfer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: current_user.id,
          transferAmount,
          paymentReason,
          recipientAccountNumber,
          senderAccountNumber,
        }),
      });

      if (response.ok) {
        // Transfert réussi, afficher le message de transfert effectué
        setTransferMessage('Transfert effectué avec succès!');
        setTransferAmount('');
        setPaymentReason('');
        setRecipientAccountNumber('');
        setsenderAccountNumber('');
        setErrorMessage('');
      } else {
        const data = await response.json();
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error('Erreur lors du transfert:', error);
      setErrorMessage('Une erreur est survenue lors du transfert. Veuillez réessayer plus tard.');
    }


    


 

    // Appel de l'API pour insérer le transfert partagé
    const requestOptionsinfoshared = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId: current_user.id,
        amount: transferAmount,
        reason: paymentReason,
        receiverAccountNumber: recipientAccountNumber,
        //senderAccountNumber: current_user.id.senderAccountNumber,
      }),
    };
    
  
    try {
      const response = await fetch('http://localhost:3000/client/transfershared', requestOptionsinfoshared);
      const data = await response.json();
  
      // Afficher le message de succès et réinitialiser le champ du montant
      alert(data.message);
      setTransferMessage('Transfert partagé effectué avec succès!');
      setTransferAmount('');
      setPaymentReason('');
      setRecipientAccountNumber('');
    } catch (error) {
      console.error('Erreur lors de la demande du transfert :', error);
      alert('Une erreur est survenue lors du transfert.');
    }

    
  
  
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
      <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
        <Grid item xs={12} sm={6}>
          <div className={classes.formContainer}>
            <Typography variant="h4" align="center">Transfer</Typography>
            <Typography variant="body1" align="center">{transferMessage}</Typography> 
            {errorMessage && (
              <Typography variant="body1" align="center" color="error" gutterBottom>
                {errorMessage}
              </Typography>
            )}
            <form onSubmit={handleTransfer}>
              <TextField
                className={classes.formInput}
                label="Amount"
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                required
                fullWidth
                variant="outlined"
              />
              <TextField
                className={classes.formInput}
                label="Payment Reason"
                value={paymentReason}
                onChange={(e) => setPaymentReason(e.target.value)}
                required
                fullWidth
                variant="outlined"
              />
              <TextField
                className={classes.formInput}
                label="Recipient Account Number"
                value={recipientAccountNumber}
                onChange={(e) => setRecipientAccountNumber(e.target.value)}
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

export default ClientTransfer;
