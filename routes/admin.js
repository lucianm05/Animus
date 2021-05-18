const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');

router.get('/admin/add-product', adminController.getAddProductPage);

router.post('/admin/add-product', adminController.postAddProductPage);

router.post('/admin/delete-product', adminController.postDeleteProduct);

router.get('/admin/orders', adminController.getOrdersPage);

router.get('/admin/orders/:orderStatus', adminController.getOrdersStatusPage);

router.get('/admin/order/:orderId', adminController.getOrderDetailsPage);

router.post('/admin/set-order-sent', adminController.postSetOrderSent);

router.post('/admin/set-order-processing', adminController.postSetOrderProcessing);

router.post('/admin/set-order-finished', adminController.postSetOrderFinished);

router.post('/admin/set-order-cancelled', adminController.postSetOrderCancelled);

module.exports = router;