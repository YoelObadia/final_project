import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from '@material-ui/core';
import UserSelection from './UserSelection';
import AdminLogin from './admin/AdminLogin';
import ClientLogin from './client/ClientLogin';
import AdminHome from './admin/AdminHome';
import ClientHome from './client/ClientHome';
import ClientRegister from './client/ClientRegister';
import CustomerInfo from './admin/CustomerInfo';
import Transfer from './admin/Transfer';
import Transactions from './admin/Transactions';
import AddAdmin from './admin/AddAdmin';

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
          <Route path="/admin/CustomerInfo" element={<CustomerInfo />} />
          <Route path="/admin/Transfer" element={<Transfer />} />
          <Route path="/admin/Transactions" element={<Transactions />} />
          <Route path="/admin/AddAdmin" element={<AddAdmin />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
