import { MongoClient } from "mongodb";
import amqp from "amqplib";
import { getOrThrow } from "./getOrThrow";
import { Server } from "./interfaces/Server";

const AMQP_URI = getOrThrow("AMQP_URI");
const MONGODB_URI = getOrThrow("MONGO_URI");

const client = new MongoClient(MONGODB_URI);

export async function consumeServer(params: Server) {
  const connection = await amqp.connect(AMQP_URI);
  const channel = await connection.createChannel();

  await channel.assertExchange(params.exchangeName, params.exchangeType, {
    durable: false,
  });

  const q = await channel.assertQueue("", {
    exclusive: true,
  });

  await channel.bindQueue(q.queue, params.exchangeName, params.routingKey);

  const database = client.db(params.databaseName);
  const collection = database.collection(params.collectionName);

  await channel.consume(q.queue, async (msg) => {
    if (msg !== null) {
      const raw = msg.content.toString();

      await collection.insertOne({
        raw,
      });

      channel.ack(msg);
    }
  });
}
