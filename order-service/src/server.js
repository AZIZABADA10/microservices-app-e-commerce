const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();




const orderRoutes = require('./routes/orderRoutes');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

app.use('/api/orders', orderRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté pour le order-service'))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Order-Service en ligne sur le port ${PORT}`));
