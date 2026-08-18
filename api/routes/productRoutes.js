const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

router.get('/', productController.getAllProducts);
// Only admins can create, update, and delete products
router.post('/', authenticate, authorize(['admin']), productController.createProduct);
router.put('/:id', authenticate, authorize(['admin']), productController.updateProduct);
router.delete('/:id', authenticate, authorize(['admin']), productController.deleteProduct);

module.exports = router;
