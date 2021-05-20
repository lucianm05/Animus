const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');

router.get('/sign-up', authController.getSignUpPage);

router.get('/sign-in', authController.getSignInPage);

router.post('/sign-up', authController.postSignUp);

router.post('/sign-in', authController.postSignIn);

router.post('/logout', authController.postLogout);

module.exports = router;