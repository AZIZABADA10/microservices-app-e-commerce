const Order = require('../models/Order');
const { checkProductExists } = require('../services/productService');

// POST /orders
exports.createOrder = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const product = await checkProductExists(productId);
    if (!product) return res.status(404).json({ message: 'Produit introuvable' });

    const order = new Order({ productId, quantity });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
