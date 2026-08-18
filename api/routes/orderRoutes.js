const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// All order routes require authentication
router.use(authenticate);

// User routes
router.post('/', orderController.createOrder);
router.get('/my', orderController.getUserOrders);
router.get('/:id', orderController.getOrderDetails);

// Admin-only routes
router.get('/', authorize(['admin']), orderController.getAllOrders);
router.put('/:id/status', authorize(['admin']), orderController.updateOrderStatus);
router.patch('/:id/status', authorize(['admin']), orderController.updateOrderStatus);
router.delete('/:id', authorize(['admin']), orderController.deleteOrder);

module.exports = router;
