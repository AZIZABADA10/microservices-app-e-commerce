// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { publishUserCreated } = require('../rabbitmq');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérification
    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    // Vérifie si l'utilisateur existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Utilisateur déjà existant" });
    }

    // Création de l'utilisateur
    const user = await User.create({ email, password });

    // Envoi du message RabbitMQ
    publishUserCreated({
      id: user._id,
      email: user.email,
      createdAt: new Date()
    });

    res.status(201).json({ message: "Utilisateur créé", user });

  } catch (error) {
    console.error("❌ Erreur lors de l'inscription :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérification
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    // Générer un token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || "secret_token", {
    });

    res.status(200).json({ message: "Connexion réussie", token });
  } catch (error) {
    console.error("❌ Erreur lors de la connexion :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// Routes d'authentification
router.post('/register', authController.register);
router.post('/login', authController.login);

// Routes profil utilisateur
router.get('/profile', protect, authController.getUserProfile);
router.put('/profile', protect, authController.updateUserProfile);

// Routes admin pour la gestion des utilisateurs
router.get('/users', protect, adminOnly, userController.getAllUsers);
router.put('/users/:userId/role', protect, adminOnly, userController.updateUserRole);
router.delete('/users/:userId', protect, adminOnly, userController.deleteUser);

module.exports = router;
