const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

router.get('/user-panel', userController.getUserPanelPage);

router.post('/edit-username', userController.postEditUsername);

router.post('/edit-email', userController.postEditEmail);

router.post('/edit-password', userController.postEditPassword);

router.post('/add-user-address', userController.postUserAddress);

router.post('/delete-user-address', userController.postDeleteUserAddress);

router.post('/set-default-user-address', userController.postSetDefaultUserAddress);

router.get('/user-orders', userController.getUserOrdersPage);

router.get('/user-orders/:orderId', userController.getOrderDetailsPage);

router.post('/cancel-order', userController.postCancelUserOrder);

module.exports = router;