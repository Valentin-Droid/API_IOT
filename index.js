import "dotenv/config";

import amqp from "amqplib";
import express from "express";
import config from "./config.js";

const app = express();
app.use(express.json());

let channel, connection;

async function connectRabbitMQ() {
  try {
    connection = await amqp.connect(config.rabbitmqUrl);
    channel = await connection.createChannel();
    await channel.assertQueue(config.sendQueue, { durable: false });
    await channel.assertQueue(config.receiveQueue, { durable: false });
    console.log("Connected to RabbitMQ");
  } catch (err) {
    console.error("RabbitMQ connection error:", err);
    process.exit(1);
  }
}

// POST /send: send a message to RabbitMQ
app.post("/send", async (req, res) => {
  const message = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message body required" });
  }
  try {
    channel.sendToQueue(config.sendQueue, Buffer.from(JSON.stringify(message)));
    res.json({ status: "Message sent" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to send message", details: err.message });
  }
});

// GET /receive: get a message from RabbitMQ
app.get("/receive", async (req, res) => {
  try {
    const msg = await channel.get(config.receiveQueue, { noAck: true });
    if (msg) {
      res.json({ message: JSON.parse(msg.content.toString()) });
    } else {
      res.status(404).json({ error: "No messages in queue" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to receive message", details: err.message });
  }
});

// Start server after connecting to RabbitMQ
connectRabbitMQ().then(() => {
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
    console.log("POST /send to send a message");
    console.log("GET /receive to receive a message");
  });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  if (connection) await connection.close();
  process.exit(0);
});
