const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import du middleware CORS
const orderRoutes = require('./routes/orderRoutes'); // Import des routes
const { connectRabbitMQ } = require('./rabbitmq');
const app = express();

// Middleware
app.use(cors()); // Active CORS pour toutes les origines
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000, // Temps d'attente pour la sélection du serveur
  maxPoolSize: 10 // Taille maximale du pool de connexions
})
  .then(() => console.log("✅ [order-service] Connecté à MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Connexion à RabbitMQ
connectRabbitMQ();

// Enregistrement des routes
app.use('/api/orders', orderRoutes);

// Gestion des erreurs pour les routes non définies
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur serveur' });
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`🚀 [order-service] en écoute sur le port ${PORT}`);
});
