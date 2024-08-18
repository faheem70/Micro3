const Fulfillment = require('../models/fullfillmentModel');
const redisClient = require('../config/redis');
const amqp = require('amqplib');
const { v4: uuidv4 } = require('uuid');

let channel, connection;

const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URI);
    channel = await connection.createChannel();
    await channel.assertQueue('payment.processed');
    await channel.assertQueue('order.fulfilled');
    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
  }
};

const processFulfillment = async (payment) => {
  const fulfillmentId = uuidv4();
  const fulfillment = new Fulfillment({
    fulfillmentId,
    orderId: payment.orderId,
    status: 'fulfilled',
  });

  await fulfillment.save();
  redisClient.setex(payment.orderId, 3600, JSON.stringify(fulfillment));

  await channel.sendToQueue('order.fulfilled', Buffer.from(JSON.stringify(fulfillment)));
};

const consumePaymentProcessed = async () => {
  channel.consume('payment.processed', async (msg) => {
    const payment = JSON.parse(msg.content.toString());
    console.log('Fulfilling Order ID:', payment.orderId);

    // Mock fulfillment process
    await processFulfillment(payment);
    channel.ack(msg);
  });
};

module.exports = { connectRabbitMQ, consumePaymentProcessed };
