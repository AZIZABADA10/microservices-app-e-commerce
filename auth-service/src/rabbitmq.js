const amqp = require("amqplib");
const bcrypt = require("bcrypt");

let channel;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
    channel = await connection.createChannel();
    console.log("✅ [auth-service] Connecté à RabbitMQ");

    await channel.assertQueue("USER_REGISTERED");
  } catch (err) {
    console.error("❌ [auth-service] RabbitMQ connection error:", err);
    // Tentative de reconnexion après un délai
    setTimeout(connectRabbitMQ, 5000);
  }
}

function publishUserCreated(user) {
  if (!channel) {
    console.error("❌ [auth-service] RabbitMQ channel not initialized.");
    return;
  }

  channel.sendToQueue("USER_REGISTERED", Buffer.from(JSON.stringify({
    id: user._id,
    email: user.email,
    createdAt: new Date()
  })));
  console.log("📤 [auth-service] Message envoyé à USER_REGISTERED:", user);
}

async function verifyPassword(password, user) {
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }
}

module.exports = { connectRabbitMQ, publishUserCreated, verifyPassword };
