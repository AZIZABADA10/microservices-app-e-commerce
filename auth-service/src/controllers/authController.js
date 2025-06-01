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
  body('firstName').notEmpty().withMessage('Le prénom est requis'),
  body('lastName').notEmpty().withMessage('Le nom est requis'),
  body('dateOfBirth').isDate().withMessage('Date de naissance invalide'),
  body('phone').notEmpty().withMessage('Le téléphone est requis'),

  async (req, res) => {
    try {
      const { email, password, firstName, lastName, dateOfBirth, phone } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({ message: 'Un utilisateur avec cette adresse email existe déjà.' });
      }

      // Vérifier le nombre total d'utilisateurs
      const usersCount = await User.countDocuments();
      const role = usersCount === 0 ? 'ADMIN' : 'CLIENT';

      // Hachage du mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Création de l'utilisateur
      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        dateOfBirth,
        phone,
        role
      });

      await user.save();

      // Générer le token avec le rôle
      const token = jwt.sign(
        { 
          id: user._id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'Inscription réussie.',
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });

    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' });
    }
  }
];

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Générer le token avec le rôle
    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        role: user.role, 
        firstName: user.firstName,
        lastName: user.lastName
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role, 
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
};

// Ajouter ces nouvelles routes
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du profil' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, dateOfBirth, email } = req.body;
    
    // Validation des données
    if (email) {
      const emailExists = await User.findOne({ 
        email, 
        _id: { $ne: req.user.id } 
      });
      if (emailExists) {
        return res.status(400).json({ 
          message: 'Cette adresse email est déjà utilisée' 
        });
      }
    }

    // Validation du format de la date
    if (dateOfBirth && !Date.parse(dateOfBirth)) {
      return res.status(400).json({ 
        message: 'Format de date invalide' 
      });
    }

    // Validation du numéro de téléphone (exemple simple)
    if (phone && !/^\+?[\d\s-]{8,}$/.test(phone)) {
      return res.status(400).json({ 
        message: 'Format de numéro de téléphone invalide' 
      });
    }

    const updates = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(phone && { phone }),
      ...(dateOfBirth && { dateOfBirth }),
      ...(email && { email })
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { 
        new: true,
        runValidators: true 
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ 
        message: 'Utilisateur non trouvé' 
      });
    }

    res.json({
      message: 'Profil mis à jour avec succès',
      user
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour du profil',
      error: error.message 
    });
  }
};