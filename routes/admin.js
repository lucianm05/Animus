const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');

router.get('/admin/add-product', adminController.getAddProductPage);

router.post('/admin/add-product', adminController.postAddProductPage);

module.exports = router;