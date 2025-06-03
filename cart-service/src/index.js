const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { connectQueue } = require('./rabbitmq');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Connect to RabbitMQ with retry
const connectWithRetry = async () => {
    try {
        await connectQueue();
        console.log('✅ RabbitMQ ready for publishing');
    } catch (err) {
        console.error('❌ RabbitMQ setup error:', err);
        console.log('Retrying in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
    }
};

connectWithRetry();

// Routes
app.use('/api/cart', require('./routes/cartRoutes')); // Changed from cart.routes to cartRoutes

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
    console.log(`🚀 Cart service running on port ${PORT}`);
});