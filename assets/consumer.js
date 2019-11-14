const open = require("amqplib").connect(process.env.AMQP_URI);

const q = "tasks";

open.then((conn) => {
  return conn.createChannel();
}).then((ch) => {
  return ch.assertQueue(q).then((ok) => {
    return ch.consume(q, (msg) => {
      if (msg !== null) {
        const data = msg.content.toString();
        console.log(data);
        ch.ack(msg);
      }
    });
  });
});