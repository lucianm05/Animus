const express = require('express');

const router = express.Router();

const shopController = require('../controllers/shop');

router.get('/produse/:category', shopController.getAnimalCategoryPage);

router.post('/search', shopController.getSearch);

router.get('/', shopController.getIndexPage);

module.exports = router;