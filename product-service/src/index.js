const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { connectRabbitMQ } = require('./rabbitmq');
const productRoutes = require('./Routes/productRoutes'); // Assurez-vous que ce chemin est correct
require('dotenv').config(); // Pour charger MONGO_URI depuis un fichier .env

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  maxPoolSize: 10,
})
  .then(() => console.log("✅ [product-service] Connecté à MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Connexion RabbitMQ
connectRabbitMQ();

// Routes
app.use('/api/products', productRoutes);

// Servir les images statiques
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 404 - Not Found
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Erreur serveur
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur serveur' });
});

// Lancement du serveur
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🚀 [product-service] en écoute sur le port ${PORT}`);
});
