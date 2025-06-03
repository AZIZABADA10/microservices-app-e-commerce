const amqp = require('amqplib');

let channel, connection;

async function connectQueue() {
    try {
        // Use the environment variable for RabbitMQ connection
        connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        
        await channel.assertQueue('ORDER_QUEUE');
        
        console.log("✅ Connected to RabbitMQ");
        
        return channel;
    } catch (err) {
        console.error('❌ RabbitMQ Connection Error:', err);
        throw err;
    }
}

async function publishToQueue(data) {
    try {
        if (!channel) {
            await connectQueue();
        }
        
        channel.sendToQueue(
            'ORDER_QUEUE',
            Buffer.from(JSON.stringify(data)),
            { persistent: true }
        );
        
        console.log('✅ Order published to queue');
    } catch (err) {
        console.error('❌ Error publishing to queue:', err);
        throw err;
    }
}

module.exports = {
    connectQueue,
    publishToQueue
};