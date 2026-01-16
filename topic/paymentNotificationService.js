const amqp = require("amqplib");

const receiveMessages = async () => {
    try {
        const connection = await amqp.connect("amqp://admin:admin123@localhost:5672");
        const channel = await connection.createChannel();
        const exchange = "notification_exchange";
        const queue = "payment_queue";

        await channel.assertExchange(exchange, "topic", { durable: true });
        await channel.assertQueue(queue, { durable: true });

        await channel.bindQueue(queue, exchange, "payment.*");

        console.log("Waiting for messages");
        channel.consume(
            queue,
            (msg) => {
                if (msg !== null) {
                    console.log(
                        `[Payment Notification] Msg was consumed! with routing key as ${
                            msg.fields.routingKey
                        } and content as ${msg.content.toString()}`
                    );
                    channel.ack(msg);
                }
            },
            { noAck: false }
        );
    } catch (error) {
        console.error("Error:", error);
    }
};

receiveMessages();
