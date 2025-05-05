// Configuration for RabbitMQ connection and queue names
export default {
  rabbitmqUrl: process.env.RABBITMQ_URL || "amqp://localhost",
  sendQueue: process.env.RABBITMQ_SEND_QUEUE || "send_queue",
  receiveQueue: process.env.RABBITMQ_RECEIVE_QUEUE || "receive_queue",
  port: process.env.PORT || 3000,
};
