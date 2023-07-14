import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from '@material-ui/core';
import UserSelection from './UserSelection';
import AdminLogin from './AdminLogin';
import ClientLogin from './ClientLogin';
import AdminHome from './AdminHome';
import ClientHome from './ClientHome';
import ClientRegister from './ClientRegister';

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
