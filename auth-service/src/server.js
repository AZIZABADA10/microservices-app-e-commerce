const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connexion MongoDB réussie'))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Auth-Service en ligne sur le port ${PORT}`));
