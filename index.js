const net = require("net");

const clients = [
  {
    address: "35.198.22.223",
    port: 5001
  }
];

const server = net.createServer((socket) => {

  const client = new net.Socket();

  client.connect(5001, "35.198.22.223", () => {
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