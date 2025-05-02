const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.put('/:id', orderController.updateOrder); // Modifier une commande
router.delete('/:id', orderController.cancelOrder); // Annuler une commande

module.exports = router;
