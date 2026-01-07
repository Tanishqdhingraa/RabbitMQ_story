const amqp = require('amqplib');

async function consumeMail() {
  const connection = await amqp.connect("amqp://admin:admin123@localhost:5672");
  const channel = await connection.createChannel();

  const exchange = "mail_exchange";
  const queue = "mail_queue";
  const routingKey = "send_mail";

  await channel.assertExchange(exchange, "direct", { durable: false });
  await channel.assertQueue(queue, { durable: false });
  await channel.bindQueue(queue, exchange, routingKey);

  console.log("📩 Waiting for messages...");

  channel.consume(queue, msg => {
    if (msg) {
      console.log("✅ Mail received:", JSON.parse(msg.content.toString()));
      channel.ack(msg);
    }
  }, { noAck: false });
}

consumeMail();
