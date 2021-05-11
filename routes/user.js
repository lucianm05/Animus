const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

router.get('/sign-up', userController.getSignUpPage);

router.get('/sign-in', userController.getSignInPage);

router.post('/sign-up', userController.postSignUpPage);

router.post('/sign-in', userController.postSignInPage);

router.get('/cart', userController.getCartPage);

router.post('/add-to-cart', userController.postAddToCart);

router.post('/remove-from-cart/', userController.postRemoveFromCart);

router.post('/increase-quantity', userController.postIncreaseCartQuantity)

module.exports = router;