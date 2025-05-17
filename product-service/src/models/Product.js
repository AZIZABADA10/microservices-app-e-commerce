const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  stockQuantity: { type: Number, default: 0 },
  category: { type: String, required: true }, // Ajout catégorie
  images: [{ type: String }], // Tableau d'URL ou de chemins d'images
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
