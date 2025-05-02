const Order = require('../models/order.model');
const { publishOrderCreated } = require('../rabbitmq'); // Import de la fonction pour publier un message

// POST /orders
exports.createOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validation des données
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Produit et quantité requis.' });
    }

    // Création de la commande
    const newOrder = new Order({
      productId,
      quantity,
      status: 'pending'
    });

    const savedOrder = await newOrder.save();
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

// DELETE /orders/:id
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Trouver et mettre à jour le statut de la commande
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Commande non trouvée.' });
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error('Erreur lors de l\'annulation de la commande:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// PUT /orders/:id
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity) {
      return res.status(400).json({ message: 'La quantité est requise.' });
    }

    // Trouver et mettre à jour la commande
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Commande non trouvée.' });
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error('Erreur lors de la modification de la commande:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
