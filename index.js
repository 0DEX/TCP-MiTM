const net = require("net");
/* const open = require("amqplib").connect(process.env.AMQP_URI);

const q = "tasks";

// Publisher
open.then((conn) => {
  return conn.createChannel();
}).then((ch) => {
  return ch.assertQueue(q).then((ok) => { 

    
  });
}); */

const server = net.createServer((socket) => {
  const client = new net.Socket();

  client.connect(process.env.TARGET_PORT, process.env.TARGET_HOST, () => {
    console.log("client connected!");
  });

  client.on("data", (data) => {
    console.log(data.toString());
    socket.write(data);
  });

  socket.on("data", (data) => {
    console.log(data.toString());
    client.write(data);
    // ch.sendToQueue(q, data);
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

server.listen(process.env.APP_PORT, () => {
  console.log(`Server running on port ${process.env.APP_PORT}.`);
});