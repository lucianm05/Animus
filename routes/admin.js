const express = require('express');

const router = express.Router();

const guardingUtil = require('../util/guardingUtil');

const adminController = require('../controllers/admin');

router.get('/admin/add-product', guardingUtil.isLoggedIn, guardingUtil.isAdmin, adminController.getAddProductPage);

router.post('/admin/add-product', guardingUtil.isLoggedIn, guardingUtil.isAdmin, adminController.postAddProductPage);

router.get('/admin/edit-product/:prodId', guardingUtil.isLoggedIn, guardingUtil.isAdmin, adminController.getEditProductPage);

router.post('/admin/edit-product', guardingUtil.isLoggedIn, guardingUtil.isAdmin, adminController.postEditProduct);

router.post('/admin/delete-product', guardingUtil.isLoggedIn, guardingUtil.isAdmin, adminController.postDeleteProduct);

router.get('/admin/orders', guardingUtil.isLoggedIn, guardingUtil.isAdmin,adminController.getOrdersPage);

router.get('/admin/orders/:orderStatus', guardingUtil.isLoggedIn, guardingUtil.isAdmin, adminController.getOrdersStatusPage);

router.get('/admin/order/:orderId', guardingUtil.isLoggedIn, guardingUtil.isAdmin, adminController.getOrderDetailsPage);

router.post('/admin/set-order-sent', guardingUtil.isLoggedIn, guardingUtil.isAdmin, adminController.postSetOrderSent);

router.post('/admin/set-order-processing', guardingUtil.isLoggedIn, guardingUtil.isAdmin, adminController.postSetOrderProcessing);

router.post('/admin/set-order-finished', guardingUtil.isLoggedIn, guardingUtil.isAdmin, adminController.postSetOrderFinished);

router.post('/admin/set-order-cancelled', guardingUtil.isLoggedIn, guardingUtil.isAdmin, adminController.postSetOrderCancelled);

module.exports = router;