// src/rabbitmq.js
const amqp = require('amqplib');
const Order = require('./models/order.model.js'); // Import du modèle Order

let channel;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await connection.createChannel();
    console.log('✅ [order-service] Connecté à RabbitMQ');

    // Déclare la queue 'USER_REGISTERED' pour l'écoute
    await channel.assertQueue('USER_REGISTERED');
    console.log("✅ [order-service] File 'USER_REGISTERED' prête à recevoir des messages");

    // Consommer les messages de la file
    channel.consume('USER_REGISTERED', async (msg) => {
      if (msg !== null) {
        const user = JSON.parse(msg.content.toString());
        console.log('📥 [order-service] Message reçu:', user);

        // Créer une commande pour l'utilisateur
        await createWelcomeOrder(user);

        // Confirmer la réception du message
        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error('❌ [order-service] RabbitMQ connection error:', err);
  }
}

// Fonction pour créer une commande pour un utilisateur nouvellement enregistré
async function createWelcomeOrder(user) {
  try {
    // Crée une commande avec un produit par défaut (exemple ici avec un produit fictif)
    const newOrder = new Order({
      productId: 'default-product-id', // Remplace par un ID de produit réel
      quantity: 1,
      status: 'en attente'
    });

    // Sauvegarde la commande dans la base de données
    await newOrder.save();
    console.log(`📦 [order-service] Commande créée pour l'utilisateur ${user.email}:`, newOrder);
  } catch (error) {
    console.error('❌ [order-service] Erreur lors de la création de la commande:', error);
  }
}

module.exports = { connectRabbitMQ };
