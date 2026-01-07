const amqp = require('amqplib');

async function consumeNormalEmails() {
    try {
        const connection = await amqp.connect('amqp://admin:admin123@localhost:5672');
        const channel = await connection.createChannel();

        const exchange = 'emailExchange';
        await channel.assertExchange(exchange, 'direct', { durable: true });

        const queue = 'normalQueue';
        await channel.assertQueue(queue, { durable: true });

        // Bind queue to exchange with routing key 'normaluser'
        await channel.bindQueue(queue, exchange, 'normaluser');

        console.log('Waiting for normal user emails...');

        channel.consume(queue, msg => {
            if (msg !== null) {
                const emailData = JSON.parse(msg.content.toString());
                console.log(`Sending normal email to ${emailData.email}: ${emailData.content}`);
                channel.ack(msg);
            }
        }, { noAck: false });

    } catch (err) {
        console.error(err);
    }
}

consumeNormalEmails();
