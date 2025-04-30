const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { publishUserCreated } = require('../rabbitmq');
const { validationResult, body } = require('express-validator');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000, // Temps d'attente pour la sélection du serveur
  maxPoolSize: 10 // Taille maximale du pool de connexions
});

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

exports.register = [
  // Validation des entrées
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      // Vérification des données reçues (redondant mais plus clair)
      if (!email) {
        return res.status(400).json({ message: 'L\'adresse email est requise.' });
      }
      if (!password) {
        return res.status(400).json({ message: 'Le mot de passe est requis.' });
      }

      // Vérification de l'existence de l'utilisateur
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({ message: 'Un utilisateur avec cette adresse email existe déjà.' });
      }

      // Hachage du mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Création de l'utilisateur
      const user = new User({ email, password: hashedPassword });
      await user.save();

      // Publication de l'événement RabbitMQ
      publishUserCreated({
        id: user._id,
        email: user.email,
        createdAt: new Date()
      });

      res.status(201).json({
        message: 'Inscription réussie.',
        user: { id: user._id, email: user.email }
      });

    } catch (err) {
      console.error("Erreur lors de l'inscription:", err);
      res.status(500).json({ message: 'Erreur serveur lors de l\'inscription : ' + err.message });
    }
  }
];

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation des données reçues
    if (!email) {
      return res.status(400).json({ message: 'L\'adresse email est requise.' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Le mot de passe est requis.' });
    }

    // Recherche de l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Adresse email ou mot de passe incorrect(e).' });
    }

    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Adresse email ou mot de passe incorrect(e).' });
    }

    // Génération du token
    const token = generateToken(user);
    res.json({
      token,
      user: { id: user._id, email: user.email }
    });

  } catch (err) {
    console.error("Erreur lors de la connexion:", err);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion : ' + err.message });
  }
};