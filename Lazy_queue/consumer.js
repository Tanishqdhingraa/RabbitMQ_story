const amqp = require('amqplib')

async function consumer() {
  const conn = await amqp.connect('amqp://admin:admin123@127.0.0.1:5672')
  const ch = await conn.createChannel()

  // MUST match producer queue arguments
  await ch.assertQueue('lazy_orders', {
    durable: true,
    arguments: {
      'x-queue-mode': 'lazy'
    }
  })

  console.log('👂 Listening on lazy_orders...')

  ch.consume('lazy_orders', msg => {
    console.log('📥', msg.content.toString())
    ch.ack(msg)
  })
}

consumer().catch(console.error)
