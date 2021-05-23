const express = require('express');

const router = express.Router();

const guardingUtil = require('../util/guardingUtil');

const shopController = require('../controllers/shop');

router.get('/products/:category', shopController.getAnimalCategoryPage);

router.post('/search', shopController.getSearch);

router.get('/cart', guardingUtil.isLoggedIn, shopController.getCartPage);

router.post('/add-to-cart', guardingUtil.isLoggedIn, shopController.postAddToCart);

router.post('/remove-from-cart/', guardingUtil.isLoggedIn, shopController.postRemoveFromCart);

router.post('/increase-quantity', guardingUtil.isLoggedIn, shopController.postIncreaseCartQuantity)

router.get('/product/:prodId', shopController.getProductDetailPage);

router.post('/add-review', guardingUtil.isLoggedIn, shopController.postAddReview);

router.get('/send-order/:userAddressId', guardingUtil.isLoggedIn, shopController.getOrderPage);

router.post('/finish-order', guardingUtil.isLoggedIn, shopController.postFinishOrder);

router.get('/', shopController.getIndexPage);

module.exports = router;