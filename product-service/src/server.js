const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();



const productRoutes = require('./Routes/productRoutes');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

app.use('/api/products', productRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté pour le product-service'))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Product-Service en ligne sur le port ${PORT}`));
