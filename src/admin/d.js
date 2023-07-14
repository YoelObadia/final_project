import { NavLink, useNavigate } from "react-router-dom";
import { useState, createContext } from "react";
import { AppBar, Toolbar, Typography, Button, makeStyles, Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    appBar: {
        backgroundColor: 'maroon',
        width: '1550px',
        alignContent:'center',
        alignItems:'center',
        margin:'auto',
        marginLeft:'-33%'
      },
      navLink: {
        '&.active': {
          backgroundColor: theme.palette.primary.light,
        },
        textDecoration: 'none',
        color: 'inherit',
        marginRight: theme.spacing(2),
        padding: theme.spacing(1),
        borderRadius: theme.shape.borderRadius,
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
          {current_user && (
            <Typography variant="h6" className={classes.welcome}>
              Welcome {current_user.name}!
            </Typography>
          )}
          <div className={classes.navLinkContainer}>
            <NavLink className={classes.navLink} to="/admin/CustomerInfo">
              CustomerInfo
            </NavLink>
            <NavLink className={classes.navLink} to="/admin/Transfer">
              Transfer
            </NavLink>
            <NavLink className={classes.navLink} to="/admin/Transactions">
              Transactions
            </NavLink>
            <NavLink className={classes.navLink} to="/admin/AddAdmin">
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
          <Typography variant="h4">Content of the page</Typography>
        </Grid>
      </Grid>
    </div>
  );
}

export default AdminHome;