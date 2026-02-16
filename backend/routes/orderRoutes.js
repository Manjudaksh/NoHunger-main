const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', orderController.createOrder); // Public route for users to place orders
router.get('/', protect, admin, orderController.getAllOrders); // Admin only
router.put('/:id/status', protect, admin, orderController.updateOrderStatus); // Admin only
router.put('/:id/tax', protect, admin, orderController.toggleOrderTax); // Admin only

module.exports = router;
