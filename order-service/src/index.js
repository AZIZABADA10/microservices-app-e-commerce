const express = require('express');
const mongoose = require('mongoose');
const { connectRabbitMQ } = require('./rabbitmq');
const app = express();

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ [order-service] Connecté à MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Connexion à RabbitMQ
connectRabbitMQ();

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`🚀 [order-service] en écoute sur le port ${PORT}`);
});
