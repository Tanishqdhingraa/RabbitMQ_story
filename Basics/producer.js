const amqp = require('amqplib')

/*
FLOW TO REMEMBER (MENTAL MAP)
1. Connect to RabbitMQ
2. Create channel
3. Declare exchange
4. Declare queue
5. Bind queue to exchange using routing ke               y
6. Publish message
7. Close connection
*/

async function sendMail(){
    try {
        // 1️⃣ Create connection to RabbitMQ broker
        const connection = await amqp.connect("amqp://admin:admin123@localhost:5672");
        const channel = await connection.createChannel();

        // 3️⃣ Define exchange & routing key
        const exchange = "mail_exchange";
        const routingkey = "send_mail";
        const queue = "mail_queue"

        // 4️⃣ Message payload (what we send)
        const message = {
            to: 'dhingra@gmail.com',
            from: 'dhingr56a@gmail.com',
            subject:"verification code",
            body:`Hello my friend  Check your otp `,
        }
        
        /*
        assertExchange:
        - Creates exchange if not exists
        - direct → routes using routing key
        - durable:false → exchange lost on broker restart
        */
        await channel.assertExchange(exchange , 'direct',{durable:false})

        /*
        ⚠️ NOTE (REMEMBER):
        This should be assertQueue, but logic kept same as requested
        */
       await channel.assertQueue(queue,{durable:false})

        /*
        bindQueue:
        - Connects queue to exchange
        - routingkey decides which messages reach queue
        */
        await channel.bindQueue(queue,exchange,routingkey,{durable:false})

        
        // 5️⃣ Publish message to exchange with routing key
        channel.publish(
            exchange,
            routingkey,
            Buffer.from(JSON.stringify(message))
        );

        console.log(`Mail is ready to send `, message);
        
        // 6️⃣ Close connection after short delay
        setTimeout(()=>{
            connection.close()
        },500);

    } catch (error) {
        console.log(error);
    }
}

sendMail()