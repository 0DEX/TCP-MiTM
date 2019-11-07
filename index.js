const net = require("net");
const open = require("amqplib").connect("amqp://localhost");

// Publisher
open.then((conn) => {
  return conn.createChannel();
}).then((ch) => {
  return ch.assertQueue(q).then((ok) => {
    ch.sendToQueue(q, "data");
  });
});


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