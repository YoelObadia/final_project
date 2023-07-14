import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from '@material-ui/core';
import UserSelection from './UserSelection';
import AdminLogin from './admin/AdminLogin';
import ClientLogin from './client/ClientLogin';
import AdminHome from './admin/AdminHome';
import ClientHome from './client/ClientHome';
import ClientRegister from './client/ClientRegister';

function App() {
  return (
    <Router>
      <Container maxWidth="sm">
        <Routes>
          <Route path="/" element={<UserSelection />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/client/login" element={<ClientLogin />} />
          <Route path="/client/register" element={<ClientRegister />} />
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/client/home" element={<ClientHome />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
