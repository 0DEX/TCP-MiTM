const net = require("net");

const clients = [
  {
    address: "10.158.0.6",
    port: 5000
  }
];

const server = net.createServer((socket) => {

  const client = new net.Socket();

  client.connect(5000, "10.158.0.6", () => {
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

server.listen(5001, () => {
  console.log("opened server on", server.address());
});