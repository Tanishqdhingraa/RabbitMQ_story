const amqp = require("amqplib");

async function recvMail() {
    try {
        const connection = await amqp.connect("amqp://admin:admin123@localhost:5672");
        const channel = await connection.createChannel();

        await channel.assertQueue("users_mail_queue", { durable: false });
        
        channel.consume("users_mail_queue", (message) => {
            if (message !== null) {
                console.log("Recv message for Normal user ", JSON.parse(message.content));
                channel.ack(message);
            }
        }); 
    } catch (error) {
        console.log(error);
    }
}

recvMail();
