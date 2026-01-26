//Messages are stored on disk first, not memory → lower RAM usage, slower reads.
//🧠 When to use Lazy Queues
// ✅ Huge backlogs
// ✅ Low-priority jobs
// ✅ RAM pressure
// ❌ Ultra-low latency systems

const amqp = require('amqplib')

async function producer() {
  const conn = await amqp.connect('amqp://admin:admin123@127.0.0.1:5672')
  const ch = await conn.createChannel()

  // Lazy queue: messages go to disk immediately
  await ch.assertQueue('lazy_orders', {
  durable: true,
  arguments: {
    'x-queue-mode': 'lazy'
  }
  })


  // const msg = JSON.stringify({ orderId: 101, item: 'laptop ordered' })

  // Persistent message (survives broker restart)
  
  ch.sendToQueue('lazy_orders', Buffer.from(JSON.stringify('hello')), {persistent: true})

  console.log('📤 Sent to lazy queue')

  await ch.close()
  await conn.close()
}

producer()
