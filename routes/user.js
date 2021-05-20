const express = require('express');

const router = express.Router();

const guardingUtil = require('../util/guardingUtil');

const userController = require('../controllers/user');

router.get('/user-panel', guardingUtil.isLoggednIn, userController.getUserPanelPage);

router.post('/edit-username', guardingUtil.isLoggednIn, userController.postEditUsername);

router.post('/edit-email', guardingUtil.isLoggednIn, userController.postEditEmail);

router.post('/edit-password', guardingUtil.isLoggednIn, userController.postEditPassword);

router.post('/add-user-address', guardingUtil.isLoggednIn, userController.postUserAddress);

router.post('/delete-user-address', guardingUtil.isLoggednIn, userController.postDeleteUserAddress);

router.post('/set-default-user-address', guardingUtil.isLoggednIn, userController.postSetDefaultUserAddress);

router.get('/user-orders', guardingUtil.isLoggednIn, userController.getUserOrdersPage);

router.get('/user-orders/:orderId', guardingUtil.isLoggednIn, userController.getOrderDetailsPage);

router.post('/cancel-order', guardingUtil.isLoggednIn, userController.postCancelUserOrder);

module.exports = router;