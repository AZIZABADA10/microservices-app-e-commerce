const Product = require('../models/Product');

// GET /products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.error('Erreur lors de la récupération des produits:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// GET /products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
    res.status(200).json(product);
  } catch (err) {
    console.error('Erreur lors de la récupération du produit:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// POST /products
exports.createProduct = async (req, res) => {
  try {
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    const productData = {
      ...req.body,
      images,
    };
    const newProduct = new Product(productData);
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Erreur lors de la création du produit:', err);
    res.status(400).json({ message: 'Données invalides.' });
  }
};

// PUT /products/:id
exports.updateProduct = async (req, res) => {
  try {
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    const updatedData = {
      ...req.body,
    };

    if (images.length > 0) {
      updatedData.images = images;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Produit non trouvé' });
    res.status(200).json(updated);
  } catch (err) {
    console.error('Erreur lors de la mise à jour du produit:', err);
    res.status(400).json({ message: 'Données invalides.' });
  }
};

// DELETE /products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Produit non trouvé' });
    res.status(200).json({ message: 'Produit supprimé' });
  } catch (err) {
    console.error('Erreur lors de la suppression du produit:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
