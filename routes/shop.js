const express = require('express');

const router = express.Router();

const shopController = require('../controllers/shop');

router.get('/products/:category', shopController.getAnimalCategoryPage);

router.post('/search', shopController.getSearch);

router.get('/cart', shopController.getCartPage);

router.post('/add-to-cart', shopController.postAddToCart);

router.post('/remove-from-cart/', shopController.postRemoveFromCart);

router.post('/increase-quantity', shopController.postIncreaseCartQuantity)

router.get('/product/:prodId', shopController.getProductDetailPage);

router.get('/', shopController.getIndexPage);

module.exports = router;