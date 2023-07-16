const express = require('express');
const router = express.Router();

// Importer les contrôleurs pour le côté client
const clientDepositController = require('../controllers/clientDepositController');
const clientHomeController = require('../controllers/clientHomeController');
const clientLoginController = require('../controllers/clientLoginController');
const clientRegisterController = require('../controllers/clientRegisterController');
const clientTransactionsController = require('../controllers/clientTransactionsController');
const clientTransferController = require('../controllers/clientTransferController');
const clientWithdrawalController = require('../controllers/clientWithdrawalController');

// Routes pour le côté client
router.post('/client/deposit', clientDepositController.deposit);
router.get('/client/home', clientHomeController.getHome);
router.post('/client/login', clientLoginController.login);
router.post('/client/register', clientRegisterController.register);
router.get('/client/transactions', clientTransactionsController.getTransactions);
router.post('/client/transfer', clientTransferController.transfer);
router.post('/client/withdrawal', clientWithdrawalController.withdrawal);

module.exports = router;
