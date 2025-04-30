// src/rabbitmq.js
const amqp = require('amqplib');
const Order = require('./models/order.model'); // Import du modèle Order

let channel;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await connection.createChannel();
    console.log('✅ [order-service] Connecté à RabbitMQ');

    // Déclare la queue 'ORDER_CREATED' pour l'écoute
    await channel.assertQueue('ORDER_CREATED');
    console.log("✅ [order-service] File 'ORDER_CREATED' est prête à recevoir des messages");

    // Consommer les messages de la file
    channel.consume('ORDER_CREATED', async (msg) => {
      if (msg !== null) {
        try {
          const orderData = JSON.parse(msg.content.toString());
          console.log('📥 [order-service] Message reçu:', orderData);

          // Ajouter la commande dans la base de données
          const newOrder = new Order(orderData);
          await newOrder.save();
          console.log('✅ [order-service] Commande ajoutée avec succès:', newOrder);

          // Confirmer la réception du message
          channel.ack(msg);
        } catch (err) {
          console.error('❌ [order-service] Erreur lors du traitement du message:', err);
        }
      }
    });
  } catch (err) {
    console.error('❌ [order-service] RabbitMQ connection error:', err);
    setTimeout(connectRabbitMQ, 5000); // Reconnexion après 5 secondes
  }
}

function publishOrderCreated(order) {
  if (!channel) {
    console.error('❌ [order-service] RabbitMQ channel not initialized.');
    return;
  }

  channel.sendToQueue('ORDER_CREATED', Buffer.from(JSON.stringify(order)));
  console.log('📤 [order-service] Message envoyé à ORDER_CREATED:', order);
}

module.exports = { connectRabbitMQ, publishOrderCreated };
