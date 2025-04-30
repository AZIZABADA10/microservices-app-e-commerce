const Order = require('../models/order.model');
const { publishOrderCreated } = require('../rabbitmq'); // Import de la fonction pour publier un message

// POST /orders
exports.createOrder = async (req, res) => {
  try {
    const { userId, products, totalAmount } = req.body;

    // Validation des données
    if (!userId || !products || !totalAmount) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    // Création de la commande
    const newOrder = new Order({
      userId,
      products,
      totalAmount,
      status: 'pending'
    });

    const savedOrder = await newOrder.save();

    // Publier un message dans RabbitMQ
    publishOrderCreated(savedOrder);

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('Erreur lors de la création de la commande:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
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
