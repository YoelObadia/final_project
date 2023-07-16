import { NavLink, useNavigate } from "react-router-dom";
import { useState, createContext } from "react";
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
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [current_user] = useState(user);
  const navigate = useNavigate();
  const classes = useStyles();

  function Logout(event) {
    event.preventDefault();
    navigate("/");
    localStorage.removeItem("currentUser");
  }

  return (
    <div>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
        <Typography variant="h6" className={classes.welcome}>
            Welcome [Username]!
          </Typography>
          {current_user && (
            <Typography variant="h6" className={classes.welcome}>
              Welcome {current_user.name}!
            </Typography>
          )}
          <div className={classes.navLinkContainer}>
            <NavLink className={classes.navLink} to="/admin/customerInfo">
              CustomerInfo
            </NavLink>
            <NavLink className={classes.navLink} to="/admin/transfer">
              Transfer
            </NavLink>
            <NavLink className={classes.navLink} to="/admin/transactions">
              Transactions
            </NavLink>
            <NavLink className={classes.navLink} to="/admin/addAdmin">
              Add Administrator
            </NavLink>
            <NavLink className={classes.navLink} to="/admin/customerAccount">
              Accounts
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