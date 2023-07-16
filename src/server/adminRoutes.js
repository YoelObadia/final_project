const express = require('express');
const router = express.Router();

// Importer les contrôleurs pour le côté admin
const adminHomeController = require('../controllers/adminHomeController');
const adminLoginController = require('../controllers/adminLoginController');
const customerInfoController = require('../controllers/customerInfoController');
const transactionsController = require('../controllers/transactionsController');
const transferController = require('../controllers/transferController');
const customerAccountController = require('../controllers/customerAccountController');
const addAdminController = require('../controllers/addAdminController');

// Routes pour le côté admin
router.get('/admin/home', adminHomeController.getHome);
router.post('/admin/login', adminLoginController.login);
router.get('/admin/customer-info/:customerId', customerInfoController.getCustomerInfo);
router.get('/admin/transactions', transactionsController.getTransactions);
router.post('/admin/transfer', transferController.transfer);
router.get('/admin/customer-account/:customerId', customerAccountController.getAccount);
router.post('/admin/add-admin', addAdminController.addAdmin);

module.exports = router;
