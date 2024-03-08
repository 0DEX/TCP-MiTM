import net from "net";
import amqp from "amqplib";
import { getOrThrow } from "./getOrThrow";
import { Server } from "./interfaces/Server";

const AMQP_URI = getOrThrow("AMQP_URI");

export const connectToServer = (params: Server) => {
  let channel: amqp.Channel | undefined;

  async function message() {
    try {
      const connection = await amqp.connect(AMQP_URI);
      channel = await connection.createChannel();

      await channel.assertExchange(params.exchangeName, params.exchangeType, {
        durable: false,
      });

    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }

      setTimeout(() => {
        message();
      }, 5000);
    }
  }

  const server = net
    .createServer((socket) => {
      const client = new net.Socket();

      console.log(
        `[socket connected]: (${socket.remoteAddress}:${socket.remotePort})`
      );

      client.connect(params.targetPort, params.targetHost, () => {
        console.log(
          `[client connected]: (${socket.remoteAddress}:${socket.remotePort})`
        );
      });

      client.on("data", (data) => {
        console.log(
          `[client data]: (${socket.remoteAddress}:${
            socket.remotePort
          }) ${data.toString()}`
        );
        socket.write(data);
      });

      socket.on("data", (data) => {
        console.log(
          `[socket data]: (${socket.remoteAddress}:${
            socket.remotePort
          }) ${data.toString()}`
        );
        client.write(data);

        if (channel) {
          try {
            channel.publish(params.exchangeName, params.routingKey, data);
          } catch (error) {
            if (error instanceof Error) {
              console.error(error.message);
            }

            message();
          }
        }
      });

      client.on("end", () => {
        console.log(
          `[disconnected]: (${socket.remoteAddress}:${socket.remotePort})`
        );
        socket.end();
      });

      socket.on("end", () => {
        client.end();
      });
    })
    .on("error", (err) => {
      console.error(err);
      throw err;
    });

  server.listen(params.originPort, async () => {
    await message();
    console.log(`app running on port ${params.originPort}`);
  });
};
