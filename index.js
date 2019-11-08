const net = require("net");
const open = require("amqplib").connect(process.env.AMQP_URI);

const q = "tasks";

// Publisher
open.then((conn) => {
  return conn.createChannel();
}).then((ch) => {
  return ch.assertQueue(q).then((ok) => {
    const data = "##,imei:000000000000000,A;";
    

    const server = net.createServer((socket) => {
      const client = new net.Socket();

      client.connect(5001, "10.158.0.6", () => {
        console.log("client connected!");
      });

      client.on("data", (data) => {
        console.log(data.toString());
        socket.write(data);
      });

      socket.on("data", (data) => {
        console.log(data.toString());
        client.write(data);
        ch.sendToQueue(q, data);
      });

      client.on("end", () => {
        console.log("client disconnected!");
        socket.end();
      });

      socket.on("end", () => {
        client.end();
      });
    }).on("error", (err) => {
      throw err;
    });

    server.listen(5000, () => {
      console.log("opened server on", server.port);
    });
  });
});