const express = require('express');
const { check } = require('express-validator/check');

const router = express.Router();

const guardingUtil = require('../util/guardingUtil');

const userController = require('../controllers/user');

router.get('/user-panel', guardingUtil.isLoggedIn, userController.getUserPanelPage);

router.post('/edit-username', guardingUtil.isLoggedIn, userController.postEditUsername);

router.post('/edit-email', 
  guardingUtil.isLoggedIn, 
  check('email', 'Adresa de email introdusă este invalidă.').isEmail(),  
  userController.postEditEmail);

router.post('/edit-password', 
  guardingUtil.isLoggedIn, 
  check('password', 'Parola introdusă trebuie să fie lungă de cel puțin 8 caractere.').isLength({min: 8}),
  userController.postEditPassword);

router.post('/add-user-address', 
  guardingUtil.isLoggedIn, 
  check('phoneNumber').isLength({ max: 10, min: 10 }).withMessage('Numărul de telefon introdus este invalid. Acesta trebuie să aibă 10 caractere.'), 
  userController.postUserAddress);

router.post('/delete-user-address', guardingUtil.isLoggedIn, userController.postDeleteUserAddress);

router.post('/set-default-user-address', guardingUtil.isLoggedIn, userController.postSetDefaultUserAddress);

router.get('/user-orders', guardingUtil.isLoggedIn, userController.getUserOrdersPage);

router.get('/user-orders/:orderId', guardingUtil.isLoggedIn, userController.getOrderDetailsPage);

router.post('/cancel-order', guardingUtil.isLoggedIn, userController.postCancelUserOrder);

module.exports = router;
