const express = require('express');

const router = express.Router();

const guardingUtil = require('../util/guardingUtil');

const shopController = require('../controllers/shop');

router.get('/products/:category', shopController.getAnimalCategoryPage);

router.post('/search', shopController.getSearch);

router.get('/cart', guardingUtil.isLoggednIn, shopController.getCartPage);

router.post('/add-to-cart', guardingUtil.isLoggednIn, shopController.postAddToCart);

router.post('/remove-from-cart/', guardingUtil.isLoggednIn, shopController.postRemoveFromCart);

router.post('/increase-quantity', guardingUtil.isLoggednIn, shopController.postIncreaseCartQuantity)

router.get('/product/:prodId', shopController.getProductDetailPage);

router.post('/add-review', guardingUtil.isLoggednIn, shopController.postAddReview);

router.get('/send-order/:userAddressId', guardingUtil.isLoggednIn, shopController.getOrderPage);

router.post('/finish-order', guardingUtil.isLoggednIn, shopController.postFinishOrder);

router.get('/', shopController.getIndexPage);

module.exports = router;