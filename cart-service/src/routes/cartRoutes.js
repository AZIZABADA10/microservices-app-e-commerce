const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Cart routes
router.post('/add', cartController.addToCart);
router.get('/:userId', cartController.getCart); // Changed from /user to /:userId
router.put('/:userId/items/:productId', cartController.updateItem);
router.delete('/:userId/items/:productId', cartController.removeItem);

module.exports = router;