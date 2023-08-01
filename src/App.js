import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from '@material-ui/core';
import UserSelection from './UserSelection';
import AdminLogin from './admin/AdminLogin';
import ClientLogin from './client/ClientLogin';
import AdminHome from './admin/AdminHome';
import ClientHome from './client/ClientHome';
import ClientRegister from './client/ClientRegister';
import ClientDeposit from './client/ClientDeposit';
import ClientWithdrawal from './client/ClientWithdrawal';
import ClientTransfer from './client/ClientTransfer';
import ClientTransactions from './client/ClientTransactions';
import CustomerInfo from './admin/CustomerInfo';
import Transactions from './admin/Transactions';
import AddAdmin from './admin/AddAdmin';

function App() {
  return (
    <Router>
      <Container maxWidth="sm">
        <Routes>
          <Route path="/" element={<UserSelection />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/admin/customerInfo" element={<CustomerInfo />} />
          <Route path="/client/login" element={<ClientLogin />} />
          <Route path="/client/register" element={<ClientRegister />} />
          <Route path="/client/home" element={<ClientHome />} />
          <Route path="/client/deposit" element={<ClientDeposit />} />
          <Route path="/client/withdrawal" element={<ClientWithdrawal />} />
          <Route path="/client/transfer" element={<ClientTransfer />} />
          <Route path="/client/transactions" element={<ClientTransactions />} />
          <Route path="/admin/transactions" element={<Transactions />} />
          <Route path="/admin/addAdmin" element={<AddAdmin />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
