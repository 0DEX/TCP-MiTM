const open = require("amqplib").connect(process.env.AMQP_URI);

const q = "tasks";

open.then((conn) => {
  return conn.createChannel();
}).then((ch) => {
  return ch.assertQueue(q).then((ok) => {
    const data = "##,imei:000000000000000,A;";
    console.log(data);
    ch.sendToQueue(q, Buffer.from(data));
  });
});