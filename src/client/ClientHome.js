import { AppBar, Toolbar, Typography, Button, Grid } from '@material-ui/core';

function ClientHome() {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Your Navbar Title</Typography>
          <Button color="inherit">Deposit</Button>
          <Button color="inherit">Withdrawal</Button>
          <Button color="inherit">Transfer</Button>
          <Button color="inherit">Transactions</Button>
          <Button color="inherit">Logout</Button>
        </Toolbar>
      </AppBar>
      <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
        <Grid item>
          {/* Modify this to client of url */}
          <Typography variant="h4">Welcome Client!</Typography>
        </Grid>
      </Grid>
    </div>
  );
}

export default ClientHome;
