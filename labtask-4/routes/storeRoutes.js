const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

router.get('/', storeController.renderHomepage);
router.get('/contact-us', storeController.renderContact);
router.get('/products', storeController.getProducts);

module.exports = router;