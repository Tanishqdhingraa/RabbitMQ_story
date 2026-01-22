const amqp = require("amqplib"); // RabbitMQ client for Node.js

// Function to announce a new product
const announceNewProduct = async (product) => {
    try {
        // Connect to RabbitMQ server
        const connection = await amqp.connect(
            "amqp://admin:admin123@localhost:5672"
        );

        // Create a channel (lightweight communication path)
        const channel = await connection.createChannel();

        // Exchange name and type
        const exchange = "new_product_launch";
        const exchangeType = "fanout";

        // Ensure exchange exists (create if not)
        await channel.assertExchange(exchange, exchangeType, {
            durable: true // survives broker restart
        });

        // Convert JS object to JSON string
        const message = JSON.stringify(product);

        // Publish message to fanout exchange
        channel.publish(
            exchange,
            "", // routing key ignored in fanout
            Buffer.from(message), // message as buffer
            { persistent: true } // save message to disk
        );

        console.log("Sent =>", message);

        // Close connection after message is sent
        setTimeout(() => {
            connection.close();
        }, 500);

    } catch (error) {
        // Handle connection or publish errors
        console.error("Error:", error);
    }
};

// Send new product launch event
announceNewProduct({
    id: 123,
    name: "iPhone 19 Pro Max",
    price: 200000
});
