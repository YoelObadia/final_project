import React from 'react';
import { Grid, Typography } from '@material-ui/core';

function AdminHome() {
  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
      <Grid item>
        <Typography variant="h4">Welcome Admin!</Typography>
      </Grid>
    </Grid>
  );
}

export default AdminHome;
