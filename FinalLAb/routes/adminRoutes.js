const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload'); // <--- IMPORT MULTER CONFIG

router.get('/', isAdmin, adminController.getDashboard);
router.get('/products/add', isAdmin, adminController.renderAddProduct);

// 1. The route to view the HTML page
router.get('/sales', isAdmin, adminController.renderSalesDashboard);

// 2. The secret API route that jQuery will ping every 10 seconds
router.get('/api/sales-data', isAdmin, adminController.getSalesDataAPI);

// --- UPDATE THESE TWO POST ROUTES ---
// Add upload.single('image') before the controller!
router.post('/products/add', isAdmin, upload.single('image'), adminController.addProduct);
router.post('/products/edit/:id', isAdmin, upload.single('image'), adminController.updateProduct);

router.post('/products/delete/:id', isAdmin, adminController.deleteProduct);
router.get('/products/edit/:id', isAdmin, adminController.renderEditProduct);

module.exports = router;