const amqp = require('amqplib');

async function sendEmails() {
    try {
        const connection = await amqp.connect('amqp://admin:admin123@localhost:5672');
        const channel = await connection.createChannel();

        const exchange = 'emailExchange';
        await channel.assertExchange(exchange, 'direct', { durable: true });

        // Messages for different users
        const messages = [
            { type: 'normaluser', email: 'normal@example.com', content: 'Hello Normal User!' },
            { type: 'subscribeuser', email: 'subscribe@example.com', content: 'Hello Subscriber here!' }
        ];

        messages.forEach(msg => {
            // Use type as routing key
            channel.publish(exchange, msg.type, Buffer.from(JSON.stringify(msg)), { persistent: true });
            console.log(`Sent email for: ${msg.type}`);
        });

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);

    } catch (err) {
        console.error(err);
    }
}

sendEmails();
