const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  status: { type: String, default: 'en attente' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
