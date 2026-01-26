const amqp = require('amqplib')

async function producercreated() {
    const conn = await amqp.connect('amqp://admin:admin123@127.0.0.1:5672');
    const channel = await conn.createChannel();

    await channel.assertQueue('lazy_orders',{durable:true,arguments:{'x-queue-mode':'lazy'}});

    channel.sendToQueue('lazy_orders',  Buffer.from(JSON.stringify('hii mera bhai')));

    console.log('👋  producer started');
    
}
producercreated()