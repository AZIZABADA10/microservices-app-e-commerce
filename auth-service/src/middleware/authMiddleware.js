const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    // Vérifier le token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Accès non autorisé' });
    }

    // Décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
  }
};

exports.adminOnly = async (req, res, next) => {
  try {
    console.log('User in request:', req.user); 
    
    if (!req.user) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    // Vérifier si l'utilisateur est admin
    const user = await User.findById(req.user.id);
    console.log('User from DB:', user); 
    
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ 
        message: 'Accès réservé aux administrateurs',
        currentRole: user?.role 
      });
    }

    next();
  } catch (error) {
    console.error('Erreur middleware admin:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
