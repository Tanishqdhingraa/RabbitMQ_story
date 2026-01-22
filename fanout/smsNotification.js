const amqp = require("amqplib"); // RabbitMQ client for Node.js

// SMS notification consumer
const smsNotification = async () => {
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
        // "" => RabbitMQ generates a unique queue name
        // exclusive => queue is deleted when connection closes
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
                // Convert message buffer to JS object
                const product = JSON.parse(msg.content.toString());

                // Business logic: send SMS notification
                console.log(
                    "Sending SMS notification for product =>",
                    product.name
                );

                // Acknowledge message after processing
                channel.ack(msg);
            }
        });

    } catch (error) {
        // Handle errors
        console.error("Error:", error);
    }
};

// Start SMS notification service
smsNotification();
