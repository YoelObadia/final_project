import { NavLink, useNavigate } from "react-router-dom";
import { useState, createContext, useEffect } from "react";
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
}));

export const EssaiContext = createContext();

export function AdminHome() {
  const admin = JSON.parse(localStorage.getItem("currentAdmin"));
  const [current_admin, setCurrentAdmin] = useState(admin);
  const navigate = useNavigate();
  const classes = useStyles();

  useEffect(() => {
    // Add event listener for popstate to handle logout on back navigation
    const handlePopstate = () => {
      localStorage.removeItem("currentAdmin");
    };
    window.addEventListener("popstate", handlePopstate);

    return () => {
      // Clean up the event listener when the component unmounts
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  function Logout(event) {
    event.preventDefault();
    localStorage.removeItem("currentAdmin");
    navigate("/", { replace: true }); // Use replace option to replace the history entry
  }

  useEffect(() => {
    if (!current_admin) {
      // If the admin is not logged in, redirect to the login page
      navigate("/", { replace: true }); // Use replace option to replace the history entry
    } else if (admin && admin.clientId) {
      fetch(`http://localhost:3000/admin/home?adminId=${admin.clientId}`)
        .then((response) => response.json())
        .then((data) => {
          setCurrentAdmin((prevUser) => ({
            ...prevUser,
            firstname: data.firstname,
            lastname: data.lastname,
          }));
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération des informations du client :",
            error
          );
          // Afficher une erreur à l'utilisateur
        });
    }
  }, [current_admin]); // Add "current_admin" to the dependency array

  return (
    <div>
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
      <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
        <Grid item>
          {/* Modify this to admin of url */}
          <Typography variant="h4">Welcome Admin</Typography>
        </Grid>
      </Grid>
    </div>
  );
}

export default AdminHome;