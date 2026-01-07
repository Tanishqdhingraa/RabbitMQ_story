const amqp = require('amqplib');

async function consumeSubscribeEmails() {
    try {
        const connection = await amqp.connect('amqp://admin:admin123@localhost:5672');
        const channel = await connection.createChannel();

        const exchange = 'emailExchange';
        await channel.assertExchange(exchange, 'direct', { durable: true });

        const queue = 'subscribeQueue';
        await channel.assertQueue(queue, { durable: true });

        // Bind queue to exchange with routing key 'subscribeuser'
        await channel.bindQueue(queue, exchange, 'subscribeuser');

        console.log('Waiting for subscriber emails...');

        channel.consume(queue, msg => {
            if (msg !== null) {
                const emailData = JSON.parse(msg.content.toString());
                console.log(`Sending subscription email to ${emailData.email}: ${emailData.content}`);
                channel.ack(msg);
            }
        }, { noAck: false });

    } catch (err) {
        console.error(err);
    }
}

consumeSubscribeEmails();
