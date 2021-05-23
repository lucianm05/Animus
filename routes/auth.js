const express = require('express');
const { check } = require('express-validator/check');

const router = express.Router();

const authController = require('../controllers/auth');

router.get('/sign-up', authController.getSignUpPage);

router.get('/sign-in', authController.getSignInPage);

router.post('/sign-up', 
  check('email', 'Adresa de email introdusă este invalidă.').isEmail(), 
  check('password', 'Parola introdusă trebuie să fie lungă de cel puțin 8 caractere.').isLength({min: 8}),
  authController.postSignUp);

router.post('/sign-in', 
  check('email', 'Adresa de email introdusă este invalidă.').isEmail(), 
  check('password', 'Parola introdusă trebuie să fie lungă de cel puțin 8 caractere.').isLength({min: 8}),
  authController.postSignIn);

router.post('/logout', authController.postLogout);

module.exports = router;