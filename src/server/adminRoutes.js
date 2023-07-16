const express = require('express');
const router = express.Router();

// Importer les contrôleurs pour le côté admin
const adminHomeController = require('./adminHomeController');
const adminLoginController = require('./adminLoginController');
const customerInfoController = require('./customerInfoController');
const transactionsController = require('./transactionsController');
const transferController = require('./transferController');
const customerAccountController = require('./customerAccountController');
const addAdminController = require('./addAdminController');

// Routes pour le côté admin
router.get('/admin/home', adminHomeController.getHome);
router.post('/admin/login', adminLoginController.login);
router.get('/admin/customer-info/:customerId', customerInfoController.getCustomerInfo);
router.get('/admin/transactions', transactionsController.getTransactions);
router.post('/admin/transfer', transferController.transfer);
router.get('/admin/customer-account/:customerId', customerAccountController.getAccount);
router.post('/admin/addadmin', addAdminController.addAdmin);

module.exports = router;
