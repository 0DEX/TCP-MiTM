const open = require("amqplib").connect("amqp://35.198.22.223");

const q = "tasks";

open.then((conn) => {
  return conn.createChannel();
}).then((ch) => {
  return ch.assertQueue(q).then((ok) => {
    setInterval(() => {
      const data = "##,imei:000000000000000,A;";
      ch.sendToQueue(q, Buffer.from(data));
      console.log(data);
    }, 1000);
  });
});