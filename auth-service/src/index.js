require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { connectRabbitMQ } = require("./rabbitmq");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection with retry logic
const connectWithRetry = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10
    });
    console.log("✅ [auth-service] Connecté à MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    console.log("Tentative de reconnexion dans 5 secondes...");
    setTimeout(connectWithRetry, 5000);
  }
};

// RabbitMQ connection
connectRabbitMQ().catch(err => {
  console.error("❌ RabbitMQ connection error:", err.message);
});

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 [auth-service] en écoute sur le port ${PORT}`);
  connectWithRetry(); // Start DB connection after server starts
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close(false, () => {
    process.exit(0);
  });
});