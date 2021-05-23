const express = require('express');

const router = express.Router();

const guardingUtil = require('../util/guardingUtil');

const adminController = require('../controllers/admin');

router.get('/admin/add-product', guardingUtil.isAdmin, adminController.getAddProductPage);

router.post('/admin/add-product', guardingUtil.isAdmin, adminController.postAddProductPage);

router.get('/admin/edit-product/:prodId', guardingUtil.isAdmin, adminController.getEditProductPage);

router.post('/admin/edit-product', guardingUtil.isAdmin, adminController.postEditProduct);

router.post('/admin/delete-product', guardingUtil.isAdmin, adminController.postDeleteProduct);

router.get('/admin/orders', guardingUtil.isAdmin,adminController.getOrdersPage);

router.get('/admin/orders/:orderStatus', guardingUtil.isAdmin, adminController.getOrdersStatusPage);

router.get('/admin/order/:orderId', guardingUtil.isAdmin, adminController.getOrderDetailsPage);

router.post('/admin/set-order-sent', guardingUtil.isAdmin, adminController.postSetOrderSent);

router.post('/admin/set-order-processing', guardingUtil.isAdmin, adminController.postSetOrderProcessing);

router.post('/admin/set-order-finished', guardingUtil.isAdmin, adminController.postSetOrderFinished);

router.post('/admin/set-order-cancelled', guardingUtil.isAdmin, adminController.postSetOrderCancelled);

module.exports = router;