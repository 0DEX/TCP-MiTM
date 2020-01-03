import net from "net";
import amqp from "amqplib";

let channel: amqp.Channel | undefined;

async function message() {
  try {
    if (!process.env.AMQP_URI) {
      throw new Error("AMQP_URI");
    }

    const connection = await amqp.connect(process.env.AMQP_URI);
    const ch = await connection.createChannel();

    await ch.assertExchange("raw", "direct", {
      durable: false
    });

    channel = ch;

  } catch (error) {
    console.error(error.message);

    setTimeout(() => {
      message();
    }, 5000);
  }
}

const server = net
  .createServer(socket => {
    const client = new net.Socket();

    if (!process.env.TARGET_PORT) {
      throw new Error("TARGET_PORT");
    }

    if (!process.env.TARGET_HOST) {
      throw new Error("TARGET_HOST");
    }

    client.connect(Number(process.env.TARGET_PORT), process.env.TARGET_HOST, () => {
      console.log("client connected!");
    });

    client.on("data", data => {
      console.log(data.toString());
      socket.write(data);
    });

    socket.on("data", data => {
      console.log(data.toString());
      client.write(data);

      const result = data.toString().split(";").filter(data => data !== "").map(data => data + ";");
      result.forEach(data => {
        if (channel) {
          try {
            channel.publish("raw", "gps103", Buffer.from(data));
          } catch (error) {
            console.error(error.message);
            channel = undefined;
            message();
          }
        }
      });
    });

    client.on("end", () => {
      console.log("client disconnected!");
      socket.end();
    });

    socket.on("end", () => {
      client.end();
    });
  })
  .on("error", err => {
    throw err;
  });

if (!process.env.APP_PORT) {
  throw new Error("APP_PORT");
}

message();

server.listen(process.env.APP_PORT, () => {
  console.log(`app running on port ${process.env.APP_PORT}`);
});
