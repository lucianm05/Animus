const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

router.get('/sign-up', userController.getSignUpPage);

router.get('/sign-in', userController.getSignInPage);

router.post('/sign-up', userController.postSignUpPage);

router.post('/sign-in', userController.postSignInPage);

router.get('/user-panel', userController.getUserPanelPage);

router.post('/edit-username', userController.postEditUsername);

router.post('/edit-email', userController.postEditEmail);

router.post('/edit-password', userController.postEditPassword);

module.exports = router;