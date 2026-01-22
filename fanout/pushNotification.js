const amqp = require("amqplib"); // RabbitMQ client for Node.js

// Push notification consumer
const pushNotification = async () => {
    try {
        // Connect to RabbitMQ server
        const connection = await amqp.connect(
            "amqp://admin:admin123@localhost:5672"
        );

        // Create a channel
        const channel = await connection.createChannel();

        // Exchange details
        const exchange = "new_product_launch";
        const exchangeType = "fanout";

        // Ensure exchange exists
        await channel.assertExchange(exchange, exchangeType, {
            durable: true // exchange survives restart
        });

        // Create a temporary, exclusive queue
        // "" => auto-generated queue name
        // exclusive => deleted when connection closes
        const queue = await channel.assertQueue("", {
            exclusive: true
        });

        console.log("Waiting for msgs =>", queue.queue);

        // Bind queue to fanout exchange
        await channel.bindQueue(
            queue.queue,
            exchange,
            "" // routing key ignored in fanout
        );

        // Consume messages from the queue
        channel.consume(queue.queue, (msg) => {
            if (msg !== null) {
                // Parse message content
                const product = JSON.parse(msg.content.toString());

                // Business logic: send push notification
                console.log(
                    "Sending Push notification for product =>",
                    product.name
                );

                // Acknowledge message after successful processing
                channel.ack(msg);
            }
        });

    } catch (error) {
        // Handle connection or consumption errors
        console.error("Error:", error);
    }
};

// Start push notification service
pushNotification();
