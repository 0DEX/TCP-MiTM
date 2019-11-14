const net = require("net");
const amqp = require("amqplib");

console.log(process.env.AMQP_URI);

const open = amqp.connect(process.env.AMQP_URI);

open.then((conn) => {
  return conn.createChannel();
}).then((ch) => {
  const server = net.createServer((socket) => {
    let device;

    socket.on("data", (data) => {
      const normalizedData = normalizeData(data.toString());
      normalizedData.forEach(processNormalizedData);
    });

    function processNormalizedData(data) {
      const splited = data.toString().split(",");

      if (device) {
        console.log("device " + device);
      } else {
        switch (true) {
          case /^\d{15};$/g.test(splited[0]):
            device = splited[0].split(";")[0];
            break;
          case /^##$/g.test(splited[0]):
            device = splited[1].split(":")[1];
            break;
          case /^imei:\d{15}$/g.test(splited[0]):
            device = splited[0].split(":")[1]
            break;
          default:
            console.log("Device not identified. Ending socket...");
            socket.end();
            break;
        }

        if (device) {
          console.log("switch " + device);
        }
      }
    }
  });

  server.listen(5001, () => {
    console.log("server running on port 5001;");
  });



  /* return ch.assertQueue(q).then((ok) => {
    return ch.consume(q, (msg) => {
      if (msg !== null) {
        const data = msg.content.toString();
        console.log(data);
        ch.ack(msg);
      }
    });
  }); */
});

function normalizeData(data) {
  const splited = data.split(";");
  const filtered = splited.filter((value) => value !== "");
  const result = filtered.map((value) => value + ";");
  return result;
}