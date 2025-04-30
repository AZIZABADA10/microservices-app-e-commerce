// src/rabbitmq.js
const amqp = require('amqplib');

let channel;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await connection.createChannel();
    console.log('✅ [product-service] Connecté à RabbitMQ');

    // Déclare la queue 'USER_REGISTERED' pour l'écoute
    await channel.assertQueue('USER_REGISTERED');
    console.log("✅ [product-service] File 'USER_REGISTERED' est prête à recevoir des messages");

    // Consommer les messages de la file
    channel.consume('USER_REGISTERED', (msg) => {
      if (msg !== null) {
        try {
          const user = JSON.parse(msg.content.toString());
          console.log('📥 [product-service] Message reçu:', user);

          // Ajoutez ici la logique métier (par exemple, ajouter un produit de bienvenue)

          // Confirmer la réception du message
          channel.ack(msg);
        } catch (err) {
          console.error('❌ Erreur lors du traitement du message:', err);
        }
      }
    });
  } catch (err) {
    console.error('❌ [product-service] RabbitMQ connection error:', err);
    setTimeout(connectRabbitMQ, 5000); // Reconnexion après 5 secondes
  }
}

module.exports = { connectRabbitMQ };
