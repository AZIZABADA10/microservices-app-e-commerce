const amqp = require('amqplib');
const Product = require('./models/Product'); // Import du modèle Product

let channel;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await connection.createChannel();
    console.log('✅ [product-service] Connecté à RabbitMQ');

    // Déclare la queue 'PRODUCT_ADDED' pour l'écoute
    await channel.assertQueue('PRODUCT_ADDED');
    console.log("✅ [product-service] File 'PRODUCT_ADDED' est prête à recevoir des messages");

    // Consommer les messages de la file
    channel.consume('PRODUCT_ADDED', async (msg) => {
      if (msg !== null) {
        try {
          const productData = JSON.parse(msg.content.toString());
          console.log('📥 [product-service] Message reçu:', productData);

          // Ajouter le produit dans la base de données
          const newProduct = new Product(productData);
          await newProduct.save();
          console.log('✅ [product-service] Produit ajouté avec succès:', newProduct);

          // Confirmer la réception du message
          channel.ack(msg);
        } catch (err) {
          console.error('❌ [product-service] Erreur lors du traitement du message:', err);
        }
      }
    });
  } catch (err) {
    console.error('❌ [product-service] RabbitMQ connection error:', err);
    setTimeout(connectRabbitMQ, 5000); // Reconnexion après 5 secondes
  }
}

module.exports = { connectRabbitMQ };
