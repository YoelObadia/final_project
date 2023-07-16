const express = require('express');
const router = express.Router();

// Importer les contrôleurs pour le côté client
const clientDepositController = require('./clientDepositController');
const clientHomeController = require('./clientHomeController');
const clientLoginController = require('./clientLoginController');
const clientRegisterController = require('./clientRegisterController');
const clientTransactionsController = require('./clientTransactionsController');
const clientTransferController = require('./clientTransferController');
const clientWithdrawalController = require('./clientWithdrawalController');

// Routes pour le côté client
router.post('/client/deposit', clientDepositController.deposit);
router.get('/client/home', clientHomeController.getHome);
router.post('/client/login', clientLoginController.login);
router.post('/client/register', clientRegisterController.register);
router.get('/client/transactions', clientTransactionsController.getTransactions);
router.post('/client/transfer', clientTransferController.transfer);
router.post('/client/withdrawal', clientWithdrawalController.withdrawal);

module.exports = router;
